import * as yup from 'yup';

export const scheduleValidationSchema = yup.object().shape({
  event_name: yup.string().required(),
  event_date: yup.date().required(),
  team_id: yup.string().nullable().required(),
});
