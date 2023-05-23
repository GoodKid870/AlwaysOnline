import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {DataModule} from "../data/data.module";
import {ChatModule} from "../chat/chat.module";
import {ProfileController} from "../profile/profile.controller";
import {UserController} from "../user/user.controller";
import {ProfileModule} from "../profile/profile.module";
import {ProfileService} from "../profile/profile.service";
import {PrismaService} from "../../prisma/prisma.service";

@Module({
  imports: [DataModule, ChatModule, ProfileModule],
  controllers: [AppController, UserController, ProfileController],
  providers: [AppService, ProfileService, PrismaService],
})
export class AppModule {}
