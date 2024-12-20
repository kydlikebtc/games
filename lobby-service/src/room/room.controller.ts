import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { RoomService } from './room.service';
import { Room } from './interfaces/room.interface';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get()
  async findAll(): Promise<Room[]> {
    return this.roomService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Room | undefined> {
    return this.roomService.findOne(id);
  }

  @Post()
  async create(@Body() room: Room): Promise<Room> {
    return this.roomService.create(room);
  }

  @Put(':id/join/:userId')
  async join(@Param('id') id: string, @Param('userId') userId: string): Promise<Room | undefined> {
    return this.roomService.join(id, userId);
  }

  @Put(':id/leave/:userId')
  async leave(@Param('id') id: string, @Param('userId') userId: string): Promise<Room | undefined> {
    return this.roomService.leave(id, userId);
  }
}
