import * as yup from 'yup';
import { playerProgressValidationSchema } from 'validationSchema/player-progresses';

export const drillValidationSchema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string(),
  practice_plan_id: yup.string().nullable().required(),
  player_progress: yup.array().of(playerProgressValidationSchema),
});
