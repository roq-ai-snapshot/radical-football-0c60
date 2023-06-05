import * as yup from 'yup';
import { drillValidationSchema } from 'validationSchema/drills';

export const practicePlanValidationSchema = yup.object().shape({
  title: yup.string().required(),
  description: yup.string(),
  coach_id: yup.string().nullable().required(),
  drill: yup.array().of(drillValidationSchema),
});
