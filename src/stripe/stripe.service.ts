import { Injectable } from "@nestjs/common";

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
      expand: ["latest_invoice"],
    });

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

    if (
      subscription.latest_invoice &&
      typeof subscription.latest_invoice === "object"
    ) {
      const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
      if (
        (latestInvoice as any).payment_intent &&
        (latestInvoice as any).payment_intent.client_secret
      ) {
        clientSecret = (latestInvoice as any).payment_intent.client_secret;
      } else {
        if (subscription.status === "incomplete" && !user.stripeCustomerId) {
          try {
            const setupIntent = await this.stripe.setupIntents.create({
              customer: stripeCustomerId,
              usage: "off_session",
              metadata: {
                subscriptionId: subscription.id,
                userId: userId,
              },
            });
            clientSecret = setupIntent.client_secret;
            console.log("Created SetupIntent client_secret:", clientSecret);
          } catch (setupIntentError) {
            console.error("Error creating SetupIntent:", setupIntentError);
          }
        } else if (
          subscription.status === "incomplete" &&
          latestInvoice.amount_due > 0
        ) {
          try {
            const paymentIntent = await this.stripe.paymentIntents.create({
              amount: latestInvoice.amount_due,
              currency: latestInvoice.currency,
              customer: stripeCustomerId,
              off_session: false,
              confirm: false,
              metadata: {
                subscriptionId: subscription.id,
                userId: userId,
              },
            });
            clientSecret = paymentIntent.client_secret;
            console.log(
              "Created PaymentIntent for invoice client_secret:",
              clientSecret
            );
          } catch (piError) {
            console.error("Error creating PaymentIntent for invoice:", piError);
          }
        }
      }
    }

    return { clientSecret };
  }
}
