import { DrillInterface } from 'interfaces/drill';
import { CoachInterface } from 'interfaces/coach';

export interface PracticePlanInterface {
  id?: string;
  coach_id: string;
  title: string;
  description?: string;
  drill?: DrillInterface[];
  coach?: CoachInterface;
  _count?: {
    drill?: number;
  };
}
