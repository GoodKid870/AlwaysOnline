import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';

@Controller('profiles')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Get()
    getAllProfiles() {
        return this.profileService.getAllProfiles();
    }

    @Get(':id')
    getProfileById(@Param('id') id: number) {
        return this.profileService.getProfileById(id);
    }

    @Post()
    createProfile(@Body() createProfileDto: CreateProfileDto) {
        return this.profileService.createProfile(createProfileDto);
    }

    @Put(':id')
    updateProfile(@Param('id') id: number, @Body() updateProfileDto: UpdateProfileDto) {
        return this.profileService.updateProfile(id, updateProfileDto);
    }

    @Delete(':id')
    deleteProfile(@Param('id') id: number) {
        return this.profileService.deleteProfile(id);
    }
}