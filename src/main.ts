import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as bodyParser from "body-parser";
import { AppModule } from "./app.module";

function rawBodySaver(req, res, buf: Buffer, encoding: string) {
  if (buf && buf.length) {
    (req as any).rawBody = buf;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.use(
    "/webhooks/stripe",
    bodyParser.raw({
      type: "application/json",
      verify: rawBodySaver,
    })
  );

  app.enableCors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle("Portfolio Editor API")
    .setDescription("API for managing portfolio templates and customizations")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
