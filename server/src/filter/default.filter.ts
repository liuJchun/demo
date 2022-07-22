import { Catch } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';

@Catch()
export class DefaultErrorFilter {
  async catch(err: Error, ctx: Context) {
    // 所有的未分类错误会到这里

    return {
      code: '500',
      success: false,
      message: err.message || '内部发生错误！',
    };
  }
}
