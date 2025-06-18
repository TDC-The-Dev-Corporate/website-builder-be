import { Controller, Post, Body, UseGuards, Request } from "@nestjs/common";

import { StripeService } from "./stripe.service";
import { JwtGuard } from "src/auth/jwt/jwt.guard";

@Controller("payments")
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @UseGuards(JwtGuard)
  @Post("create-payment-intent")
  async createIntent(
    @Request() req,
    @Body() body: { amount: number; currency?: string }
  ) {
    const clientSecret = await this.stripeService.createPaymentIntent(
      req.user.id,
      body.amount,
      body.currency
    );
    return { clientSecret };
  }

  @UseGuards(JwtGuard)
  @Post("create-subscription")
  async createSubscription(@Request() req, @Body() body: { priceId: string }) {
    return this.stripeService.createSubscription(req.user.id, body.priceId);
  }
}
