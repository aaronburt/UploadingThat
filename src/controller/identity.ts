import { PrismaClient } from '@prisma/client';
import UTILITY, { PasswordStrength } from './utility.js';

export default class IDENTITY {

    private static prisma = new PrismaClient();

    public static async createUser(username: string, password: string): Promise<false | { id: string; username: string; }>{
        const isValidUsername = UTILITY.isUsernameValid(username)
        const isPasswordStrong = UTILITY.getPasswordStrength(password);

        if(!isValidUsername || isPasswordStrong !== PasswordStrength.STRONG){
            return false;
        }

        return await this.prisma.user.create({
            data: {
                username,
                password
            }, 
            select: {
                username: true,
                id: true
            }
        }) 
    }

    public static async generateBearer(id: string){
        return await this.prisma.bearer.create({
            data: {
                userId: id,
            }
        })
    }

    public static async verifyBearer(tokenId: string){
        const bearerUser = await this.prisma.bearer.findUnique({
            where: {
                id: tokenId
            }, 
            include: {
                user: true
            }
        });

        return bearerUser !== null ? bearerUser : false; 
    }

    public static async deleteUser(id: string): Promise<{ id: string; username: string; password: string; }>{
        return await this.prisma.user.delete({
            where: {
                id: id
            }
        })
    }

    public static async getUser(id: string): Promise<{ id: string; username: string; } | null>{
        return await this.prisma.user.findUnique({
            where: {
                id: id
            }, 

            select: {
                id: true,
                username: true,
            },
        })
    }

    public static async getUserByUsername(username: string){
        return await this.prisma.user.findUnique({
            where: {
                username: username
            },

            select: {
                id: true,
                username: true,
            },
        })
    }

    /* TODO ADD SUPPORT FOR BCRYPT, INSTEAD OF CHECKING PLAINTEXT */
    public static async checkUserPassword(username: string, plaintextPassword: string){
        return await this.prisma.user.findUnique({
            where: { 
                username: username,
                password: plaintextPassword
            },
            select: {
                id: true,
                username: true
            }
        })
    }
}