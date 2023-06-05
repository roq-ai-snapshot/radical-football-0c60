import { CoachInterface } from 'interfaces/coach';
import { PlayerInterface } from 'interfaces/player';
import { ScheduleInterface } from 'interfaces/schedule';
import { AcademyInterface } from 'interfaces/academy';

export interface TeamInterface {
  id?: string;
  name: string;
  academy_id: string;
  coach?: CoachInterface[];
  player?: PlayerInterface[];
  schedule?: ScheduleInterface[];
  academy?: AcademyInterface;
  _count?: {
    coach?: number;
    player?: number;
    schedule?: number;
  };
}
