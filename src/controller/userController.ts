import { GetUserQueryType } from '../structs/userStruct';
import { prisma } from '../utils/prismaClient';
import { Request, Response } from 'express';
import { UserIdParams } from '../structs/userStruct';
import { UserService } from '../service/userService';
import { UserRepository } from '../repository/userRepository';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);

export class UserController {
  static getUsers = async (req: Request, res: Response) => {
    const query = req.query as GetUserQueryType;
    const user = await userService.getUser(query);
    res.status(200).send(user);
  };
}
