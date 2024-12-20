export interface Room {
  id: string;
  name: string;
  gameType: string;
  maxPlayers: number;
  currentPlayers: string[];
  status: 'waiting' | 'playing' | 'finished';
  createdAt: Date;
  updatedAt: Date;
}
