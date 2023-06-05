import * as yup from 'yup';

export const playerProgressValidationSchema = yup.object().shape({
  completion_date: yup.date().required(),
  feedback: yup.string(),
  player_id: yup.string().nullable().required(),
  drill_id: yup.string().nullable().required(),
});
