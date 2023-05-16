import {BadRequestException, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller("app")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("users/:id")
  getHello(@Param('id', ParseIntPipe) id: number) {
    if (id < 5){
      throw new BadRequestException("Id пользователя должен быть больше 5")
    }
    return id
  }

  @Post("login")
  create(){
    console.log(1)
  }
}
