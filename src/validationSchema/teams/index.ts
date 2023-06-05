import * as yup from 'yup';
import { coachValidationSchema } from 'validationSchema/coaches';
import { playerValidationSchema } from 'validationSchema/players';
import { scheduleValidationSchema } from 'validationSchema/schedules';

export const teamValidationSchema = yup.object().shape({
  name: yup.string().required(),
  academy_id: yup.string().nullable().required(),
  coach: yup.array().of(coachValidationSchema),
  player: yup.array().of(playerValidationSchema),
  schedule: yup.array().of(scheduleValidationSchema),
});
