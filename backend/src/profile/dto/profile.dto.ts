import { Prisma } from '@prisma/client';

export class CreateProfileDto implements Prisma.ProfileCreateInput {
    firstName: string;
    lastName: string;
    age: number;
    bio?: string;
    avatar: string;
    user: Prisma.UserCreateNestedOneWithoutProfileInput;
}


export class UpdateProfileDto implements Prisma.ProfileUpdateInput {
    firstName?: string;
    lastName?: string;
    age?: number;
    bio?: string;
    avatar?: string;
    user?: Prisma.UserCreateNestedOneWithoutProfileInput;
}