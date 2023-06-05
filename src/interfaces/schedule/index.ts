import { TeamInterface } from 'interfaces/team';

export interface ScheduleInterface {
  id?: string;
  team_id: string;
  event_name: string;
  event_date: Date;

  team?: TeamInterface;
  _count?: {};
}
