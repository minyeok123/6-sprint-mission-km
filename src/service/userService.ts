import { UserRepository } from '../repository/userRepository';
import { GetUserQueryType } from '../structs/userStruct';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getUser(query: GetUserQueryType) {
    const { page = 0, limit = 10, order } = query;
    const orderbyOption = {
      recent: { createdAt: 'desc' },
      oldest: { createdAt: 'asc' },
    } as const;
    const getUserOptions = {
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
    };
    const user = await this.userRepository.findMany(getUserOptions);
    return user;
  }
}
