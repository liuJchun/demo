import {
  Controller,
  Get,
  Provide,
  Post,
  Inject,
  Body,
} from '@midwayjs/decorator';
import { UserService } from '../service/user.service';
import { JwtService } from '@midwayjs/jwt';

@Provide()
@Controller('/user')
export class HomeController {
  @Inject()
  userService: UserService;

  @Inject()
  jwtService: JwtService;

  @Get('/getUser')
  async home(): Promise<string> {
    return 'Hello user';
  }

  @Post('/login')
  async login(@Body() bodyData): Promise<any> {
    const user = await this.userService.getUser({
      ...bodyData,
    });

    return {
      token: this.jwtService.signSync({ ...user }),
    };
  }
}
