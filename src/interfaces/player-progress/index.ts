import { PlayerInterface } from 'interfaces/player';
import { DrillInterface } from 'interfaces/drill';

export interface PlayerProgressInterface {
  id?: string;
  player_id: string;
  drill_id: string;
  completion_date: Date;
  feedback?: string;

  player?: PlayerInterface;
  drill?: DrillInterface;
  _count?: {};
}
