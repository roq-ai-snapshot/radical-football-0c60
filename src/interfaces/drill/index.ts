import { PlayerProgressInterface } from 'interfaces/player-progress';
import { PracticePlanInterface } from 'interfaces/practice-plan';

export interface DrillInterface {
  id?: string;
  practice_plan_id: string;
  name: string;
  description?: string;
  player_progress?: PlayerProgressInterface[];
  practice_plan?: PracticePlanInterface;
  _count?: {
    player_progress?: number;
  };
}
