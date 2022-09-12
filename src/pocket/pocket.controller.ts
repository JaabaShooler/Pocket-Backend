import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PocketService } from './pocket.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUtil } from '../auth/jwt.util';

@Controller('pocket')
export class PocketController {
  constructor(
    private readonly pocketService: PocketService,
    private readonly jwtUtil: JwtUtil,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async createPocketItem(
    @Body('link') link: string,
    @Body('name') name: string,
    @Headers('Authorization') auth: string,
  ): Promise<any> {
    try {
      const { id: owner } = await this.jwtUtil.decode(auth);
      const result: any = await this.pocketService.insertPocketItem(
        owner,
        link,
        name,
      );

      if (result?.errors) {
        return {
          msg: 'Failed',
          pocketItem: result,
        };
      }

      return {
        msg: 'Created',
        pocketItem: result,
      };
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  @HttpCode(HttpStatus.OK)
  async getPocket(@Headers('Authorization') auth: string): Promise<any> {
    try {
      const { id } = await this.jwtUtil.decode(auth);
      const result = await this.pocketService.getPockets(id);
      if (!result || !result[0]) {
        throw new HttpException('Not found!', HttpStatus.NOT_FOUND);
        return;
      }
      return {
        msg: 'User pocket',
        pocket: result,
      };
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/')
  @HttpCode(HttpStatus.ACCEPTED)
  async deletePocketItem(@Headers('Authorization') auth: string): Promise<any> {
    try {
      const { id } = await this.jwtUtil.decode(auth);
      const result = await this.pocketService.deletePocketItem(id);
      if (!result) {
        throw new HttpException('Not found!', HttpStatus.NOT_FOUND);
        return;
      }
      return {
        msg: 'Deleted',
        pocket: result,
      };
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
