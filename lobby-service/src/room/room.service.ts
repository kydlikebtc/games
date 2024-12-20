import { Injectable } from '@nestjs/common';
import { Room } from './interfaces/room.interface';

@Injectable()
export class RoomService {
  private readonly rooms: Map<string, Room> = new Map();

  async findAll(): Promise<Room[]> {
    return Array.from(this.rooms.values());
  }

  async findOne(id: string): Promise<Room | undefined> {
    return this.rooms.get(id);
  }

  async create(room: Room): Promise<Room> {
    this.rooms.set(room.id, room);
    return room;
  }

  async join(roomId: string, userId: string): Promise<Room | undefined> {
    const room = this.rooms.get(roomId);
    if (room && room.currentPlayers.length < room.maxPlayers) {
      room.currentPlayers.push(userId);
      room.updatedAt = new Date();
      this.rooms.set(roomId, room);
    }
    return room;
  }

  async leave(roomId: string, userId: string): Promise<Room | undefined> {
    const room = this.rooms.get(roomId);
    if (room) {
      room.currentPlayers = room.currentPlayers.filter(id => id !== userId);
      room.updatedAt = new Date();
      this.rooms.set(roomId, room);
    }
    return room;
  }
}
