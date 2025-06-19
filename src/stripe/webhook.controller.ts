import { Controller, Post, Req, Res, Headers } from "@nestjs/common";
import { Request, Response } from "express";
import { StripeService } from "./stripe.service";

@Controller("webhooks")
export class StripeWebhookController {
  constructor(private readonly stripeService: StripeService) {}

  @Post("stripe")
  async handleStripeWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers("stripe-signature") sig: string
  ) {
    const rawBody = (req as any).rawBody;

    if (!rawBody) {
      console.error("rawBody is missing");
      return res.status(400).send("Missing rawBody");
    }

    const result = await this.stripeService.handleWebhook(sig, rawBody);

    if (result.success) {
      return res.status(200).send({ received: true });
    }

    return res.status(400).send("Webhook error");
  }
}
