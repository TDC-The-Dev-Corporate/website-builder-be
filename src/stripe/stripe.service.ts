import { BadRequestException, Injectable } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import Stripe from "stripe";

@Injectable()
export class StripeService {
  constructor(
    private readonly stripe: Stripe,
    private prisma: PrismaService
  ) {}

  async createPaymentIntent(userId: string, amount: number, currency = "usd") {
    const intent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { userId },
    });
    await this.prisma.paymentIntent.create({
      data: {
        userId,
        intentId: intent.id,
        amount,
        currency,
        status: intent.status,
      },
    });
    return intent.client_secret;
  }
  async createSubscription(userId: string, priceId: string) {
    const existing = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ["active", "trialing", "past_due"] },
      },
    });

    if (existing) {
      throw new BadRequestException("You already have an active subscription.");
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await this.stripe.customers.create({
        email: user.email!,
        metadata: { userId },
      });
      stripeCustomerId = customer.id;
      await this.prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId },
      });
    }

    const subscription = await this.stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      collection_method: "charge_automatically",
      expand: ["latest_invoice.payment_intent"],
    } as any);

    await this.prisma.subscription.create({
      data: {
        userId,
        stripeCustomerId,
        stripeSubId: subscription.id,
        priceId,
        status: subscription.status,
      },
    });

    let clientSecret: string | null = null;

    const latestInvoice = subscription.latest_invoice as Stripe.Invoice & {
      payment_intent: Stripe.PaymentIntent;
    };

    if (latestInvoice?.payment_intent?.client_secret) {
      clientSecret = latestInvoice.payment_intent.client_secret;
      console.log("✅ Got client_secret:", clientSecret);
    } else {
      console.warn("⚠️ PaymentIntent not found on invoice.");
    }

    console.log("client secret: ", clientSecret);
    return { clientSecret };
  }

  async handleWebhook(
    signature: string,
    rawBody: Buffer
  ): Promise<{ success: boolean }> {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error("❌ Webhook signature verification failed.", err.message);
      return { success: false };
    }

    console.log(`event type: ${event.type}`);

    const data = event.data.object;

    switch (event.type) {
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.created": {
        const subscription = data as Stripe.Subscription;

        await this.prisma.subscription.updateMany({
          where: { stripeSubId: subscription.id },
          data: { status: subscription.status },
        });

        console.log(
          `✅ Subscription updated: ${subscription.id} → ${subscription.status}`
        );
        break;
      }

      case "invoice.payment_succeeded": {
        const subscription = data as Stripe.Subscription;
        const subscriptionId = subscription.id;

        await this.prisma.subscription.updateMany({
          where: { stripeSubId: subscriptionId },
          data: { status: "active" }, // or invoice.status
        });

        console.log("✅ Payment succeeded and DB updated");
        break;
      }

      case "invoice.payment_failed": {
        console.log("❌ Payment failed");
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return { success: true };
  }

  async getUserSubscription(userId: string) {
    const sub = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: { in: ["active", "trialing", "past_due"] }, // any valid subscription
      },
    });

    return sub; // return null if no active
  }
}
