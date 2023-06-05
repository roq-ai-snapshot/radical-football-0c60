import * as yup from 'yup';
import { playerProgressValidationSchema } from 'validationSchema/player-progresses';

export const playerValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
  team_id: yup.string().nullable().required(),
  player_progress: yup.array().of(playerProgressValidationSchema),
});
