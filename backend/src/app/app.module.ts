import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {DataModule} from "../data/data.module";
import {ChatModule} from "../chat/chat.module";
import {ProfileController} from "../profile/profile.controller";
import {UserController} from "../user/user.controller";

@Module({
  imports: [DataModule, ChatModule],
  controllers: [AppController, UserController, ProfileController],
  providers: [AppService],
})
export class AppModule {}
