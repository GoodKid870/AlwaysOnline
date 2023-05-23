import { PrismaClient, Profile } from '@prisma/client'


export class PrismaService {
    prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createProfile(data: Profile): Promise<Profile> {
        return this.prisma.profile.create({
            data,
        });
    }

    async getProfile(id: number): Promise<Profile | null> {
        return this.prisma.profile.findUnique({
            where: {
                id,
            },
        });
    }

    async updateProfile(id: number, data: Partial<Profile>): Promise<Profile | null> {
        return this.prisma.profile.update({
            where: {
                id,
            },
            data,
        });
    }

    async deleteProfile(id: number): Promise<Profile | null> {
        return this.prisma.profile.delete({
            where: {
                id,
            },
        });
    }
}