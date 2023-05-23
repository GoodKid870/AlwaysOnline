import { Injectable } from '@nestjs/common';
import { CreateProfileDto, UpdateProfileDto } from './dto/profile.dto';
import {PrismaService} from "../../prisma/prisma.service";
import {Profile} from "@prisma/client";

@Injectable()
export class ProfileService {
    constructor(private readonly prisma: PrismaService) {}

    async getAllProfiles(): Promise<Profile[]> {
        return this.prisma.prisma.profile.findMany();
    }

    async getProfileById(id: number): Promise<Profile | null> {
        return this.prisma.prisma.profile.findUnique({
            where: { id },
        });
    }

    async createProfile(createProfileDto: CreateProfileDto): Promise<Profile> {
        return this.prisma.prisma.profile.create({
            data: createProfileDto,
        });
    }

    async updateProfile(id: number, updateProfileDto: UpdateProfileDto): Promise<Profile | null> {
        return this.prisma.prisma.profile.update({
            where: { id },
            data: updateProfileDto,
        });
    }

    async deleteProfile(id: number): Promise<Profile | null> {
        return this.prisma.prisma.profile.delete({
            where: { id },
        });
    }
}