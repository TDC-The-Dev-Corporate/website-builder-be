import { Module } from "@nestjs/common";

import Stripe from "stripe";
import { StripeController } from "./stripe.controller";
import { StripeService } from "./stripe.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

@Module({
  providers: [{ provide: Stripe, useValue: stripe }, StripeService],
  controllers: [StripeController],
  exports: [Stripe],
})
export class StripeModule {}
