import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import dotenv from "dotenv"
import * as process from "process";


// dotenv.config()

async function Init() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}
Init();
