import { Module } from "@nestjs/common";

import Stripe from "stripe";
import { StripeController } from "./stripe.controller";
import { StripeService } from "./stripe.service";
import { StripeWebhookController } from "./webhook.controller";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

@Module({
  providers: [{ provide: Stripe, useValue: stripe }, StripeService],
  controllers: [StripeController, StripeWebhookController],
  exports: [Stripe],
})
export class StripeModule {}
