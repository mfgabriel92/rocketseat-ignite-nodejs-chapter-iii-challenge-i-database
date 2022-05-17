import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User | undefined> {
    const query = this.repository.findOne({
      where: {
        id: user_id
      },
      relations: ['games']
    });

    return query;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("SELECT * FROM users ORDER BY first_name;");
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    first_name = first_name.toLowerCase();
    last_name = last_name.toLowerCase();

    return this.repository.query(`SELECT * 
                                  FROM users 
                                  WHERE LOWER(first_name) = $1 
                                  AND LOWER(last_name) = $2`, [first_name, last_name] as any);
  }
}
