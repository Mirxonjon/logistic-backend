import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Delete,
  Query,
  Put,
  Req,
  NotFoundException,
  Sse,
} from '@nestjs/common';
import { PostsService } from './logistics-message.service';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import {
  CreateLogisticMessageDto,
  GetLogisticsMessagesDto,
  UpdateLogisticMessageDto,
} from '@/types/application';
import { query } from 'express';
import { Observable, from, interval, map, switchMap } from 'rxjs';

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('post')
export class PostsController {
  constructor(private readonly logisticMessageService: PostsService) {}

  @Post()
  @ApiBody({ type: CreateLogisticMessageDto })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateLogisticMessageDto): Promise<any> {

    return this.logisticMessageService.create(data);
  }

  @Get('all')
  async getAllMessages(@Query() query: GetLogisticsMessagesDto) {
    return this.logisticMessageService.getAllMessages(query);
  }

  @Get('formatted')
  async getAllMessagesWithFormat(@Query() query: GetLogisticsMessagesDto) {
    return this.logisticMessageService.getAllMessagesWithFormat(query);
  }

  @Sse('all/sse')
  getAllMessagesSse(@Query() query: GetLogisticsMessagesDto) {
    const intervalMs =
      query.interval && query.interval >= 1000 ? query.interval : 5000; // default


    return interval(intervalMs).pipe(
      switchMap(() => from(this.logisticMessageService.getAllMessages(query))),
      map((data) => ({ data }))
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getMessage(@Param('id') id: string) {
    return this.logisticMessageService.getMessageById(Number(id));
  }

  @Put(':id')
  @ApiBody({ type: UpdateLogisticMessageDto })
  @HttpCode(HttpStatus.OK)
  async updateMessage(
    @Param('id') id: string,
    @Body() dto: UpdateLogisticMessageDto
  ) {
    return this.logisticMessageService.updateMessage(Number(id), dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteMessage(@Param('id') id: string) {
    return this.logisticMessageService.deleteMessage(Number(id));
  }
  // @Patch('restore/:id')
  // @HttpCode(HttpStatus.OK)
  // async restore(
  //   @Param('id') id: string,
  //   @Req() req: RequestWithUser
  // ): Promise<any> {
  //   return this.logisticMessageService.restore(id, req);
  // }
}
