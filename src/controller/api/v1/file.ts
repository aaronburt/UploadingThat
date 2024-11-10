import { PrismaClient } from "@prisma/client"

export default class FILE {

    private static prisma = new PrismaClient(); 

    public static async getFile(userId: string){
        return await this.prisma.file.findMany({
            where: {
                userId: userId
            }
        })
    }
}