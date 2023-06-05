import { CoachInterface } from 'interfaces/coach';
import { PlayerInterface } from 'interfaces/player';

export interface UserInterface {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roq_user_id: string;
  tenant_id: string;

  coach: CoachInterface[];
  player: PlayerInterface[];
}
