import { GetUserQueryType } from '../structs/userStruct.js';
import { prisma } from '../utils/prismaClient.js';
import { Request, Response } from 'express';
import { UserIdParams } from '../structs/userStruct.js';
export class UserController {
  static getUsers = async (req: Request, res: Response) => {
    const { page = 0, limit = 10, order } = req.query as GetUserQueryType;
    const orderbyOption = {
      recent: { createdAt: 'desc' },
      oldest: { createdAt: 'asc' },
    } as const;
    const user = await prisma.user.findMany({
      skip: page,
      take: limit,
      orderBy:
        order && (order === 'recent' || order === 'oldest')
          ? orderbyOption[order]
          : orderbyOption['recent'],
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        userPreference: { select: { receivedEmail: true } },
      },
    });
    res.status(200).send(user);
  };

  static deleteUser = async (req: Request, res: Response) => {
    const { userId } = UserIdParams.create(req.params);

    await prisma.user.delete({
      where: { id: userId },
    });
    res.sendStatus(204);
  };
}
