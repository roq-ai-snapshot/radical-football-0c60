import { PlayerProgressInterface } from 'interfaces/player-progress';
import { UserInterface } from 'interfaces/user';
import { TeamInterface } from 'interfaces/team';

export interface PlayerInterface {
  id?: string;
  user_id: string;
  team_id: string;
  player_progress?: PlayerProgressInterface[];
  user?: UserInterface;
  team?: TeamInterface;
  _count?: {
    player_progress?: number;
  };
}
