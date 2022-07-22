import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { MidwayError } from '@midwayjs/core';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';

interface IUser {
  id?: number;
  name?: string;
  pwd?: string;
}

@Provide()
export class UserService {
  @InjectEntityModel(User)
  userModal: Repository<User>;

  async getUser(options: IUser) {
    const user = await this.userModal.findOne({
      where: { name: options.name },
    });
    if (user) {
      if (user.pwd !== options.pwd) {
        throw new MidwayError('账户或密码不正确!');
      }
    } else {
      throw new MidwayError('当前用户不存在!');
    }
    return user;
  }
}
