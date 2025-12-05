import { prisma } from '../utils/prismaClient.js';

export class UserController {
  static getUsers = async (req, res) => {
    const { page = 0, limit = 10, order } = req.query;
    const orderbyOption = {
      recent: { createdAt: 'desc' },
      oldest: { createdAt: 'asc' },
    };
    const user = await prisma.user.findMany({
      skip: parseInt(page),
      take: parseInt(limit),
      orderBy: orderbyOption[order] || orderbyOption['recent'],
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
  static getUserDetail = async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        name: true,
        email: true,
        createdAt: true,
        userPreference: { select: { receivedEmail: true } },
        comment: true,
      },
    });
    res.status(200).send(user);
  };

  static deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id, 10);

    await prisma.user.delete({
      where: { id: userId },
    });
    res.sendStatus(204);
  };
}
