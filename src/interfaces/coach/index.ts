import { PracticePlanInterface } from 'interfaces/practice-plan';
import { UserInterface } from 'interfaces/user';
import { TeamInterface } from 'interfaces/team';

export interface CoachInterface {
  id?: string;
  user_id: string;
  team_id: string;
  practice_plan?: PracticePlanInterface[];
  user?: UserInterface;
  team?: TeamInterface;
  _count?: {
    practice_plan?: number;
  };
}
