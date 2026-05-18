import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser, type RequestUser } from '../common/guards/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreateMaterialRequestDto, DecisionDto } from './dto/create-material-request.dto';
import { MaterialRequestsService } from './material-requests.service';

@UseGuards(JwtAuthGuard)
@Controller('material-requests')
export class MaterialRequestsController {
  constructor(private readonly service: MaterialRequestsService) {}
  @Post() create(@Body() dto: CreateMaterialRequestDto, @CurrentUser() user: RequestUser) { return this.service.create(dto, user.userId); }
  @Get() list() { return this.service.list(); }
  @Get(':id') get(@Param('id') id: string) { return this.service.get(id); }
  @Post(':id/approve') approve(@Param('id') id: string, @Body() dto: DecisionDto, @CurrentUser() user: RequestUser) { return this.service.approve(id, user.userId, dto); }
  @Post(':id/reject') reject(@Param('id') id: string, @Body() dto: DecisionDto, @CurrentUser() user: RequestUser) { return this.service.reject(id, user.userId, dto); }
  @Post(':id/issue') issue(@Param('id') id: string, @CurrentUser() user: RequestUser) { return this.service.markIssued(id, user.userId); }
}
