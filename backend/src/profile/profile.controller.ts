// profile/profile.controller.ts

import { Controller, Get, Post, Put, Delete } from '@nestjs/common';

@Controller('profiles')
export class ProfileController {
    @Get()
    getAllProfiles() {
        // Возвращает все профили пользователей
    }

    @Get(':id')
    getProfileById() {
        // Возвращает профиль пользователя по его идентификатору
    }

    @Post()
    createProfile() {
        // Создает новый профиль пользователя
    }

    @Put(':id')
    updateProfile() {
        // Обновляет профиль пользователя по его идентификатору
    }

    @Delete(':id')
    deleteProfile() {
        // Удаляет профиль пользователя по его идентификатору
    }
}
