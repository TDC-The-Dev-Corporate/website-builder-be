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
}
