import { GetUserQueryType } from '../structs/userStruct';
import { Request, Response } from 'express';
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
