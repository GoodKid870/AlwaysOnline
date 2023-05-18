import { Controller, Get, Post, Put, Delete } from '@nestjs/common';

@Controller('users')
export class UserController {
    @Get()
    getAllUsers() {
        // Возвращает всех пользователей
    }

    @Get(':id')
    getUserById() {
        // Возвращает пользователя по его идентификатору
    }

    @Post()
    createUser() {
        // Создает нового пользователя
    }

    @Put(':id')
    updateUser() {
        // Обновляет пользователя по его идентификатору
    }

    @Delete(':id')
    deleteUser() {
        // Удаляет пользователя по его идентификатору
    }
}
