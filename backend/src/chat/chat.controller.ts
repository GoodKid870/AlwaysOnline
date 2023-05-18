import { Controller, Get, Post, Put, Delete } from '@nestjs/common';

@Controller('chats')
export class ChatController {
    @Get()
    getAllChats() {
        // Возвращает все чаты
    }

    @Get(':id')
    getChatById() {
        // Возвращает чат по его идентификатору
    }

    @Post()
    createChat() {
        // Создает новый чат
    }

    @Put(':id')
    updateChat() {
        // Обновляет чат по его идентификатору
    }

    @Delete(':id')
    deleteChat() {
        // Удаляет чат по его идентификатору
    }
}
