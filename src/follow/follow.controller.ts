import { Controller, Get, Post, Body, Query, ParseIntPipe } from '@nestjs/common';
import { FollowService } from './follow.service';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get()
  async findByLeadId(@Query('lead_id') leadId: string) {
    return this.followService.findByLeadId(parseInt(leadId));
  }

  @Post()
  async create(@Body() body: any) {
    const data: any = {
      content: body.content,
      followTime: new Date(),
    };

    if (body.lead_id) data.leadId = body.lead_id;
    if (body.next_follow_time) data.nextFollowTime = new Date(body.next_follow_time);

    return this.followService.create(data);
  }
}