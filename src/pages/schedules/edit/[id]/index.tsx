import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getScheduleById, updateScheduleById } from 'apiSdk/schedules';
import { Error } from 'components/error';
import { scheduleValidationSchema } from 'validationSchema/schedules';
import { ScheduleInterface } from 'interfaces/schedule';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { TeamInterface } from 'interfaces/team';
import { getTeams } from 'apiSdk/teams';

function ScheduleEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ScheduleInterface>(
    () => (id ? `/schedules/${id}` : null),
    () => getScheduleById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ScheduleInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateScheduleById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ScheduleInterface>({
    initialValues: data,
    validationSchema: scheduleValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Schedule
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="event_name" mb="4" isInvalid={!!formik.errors?.event_name}>
              <FormLabel>event_name</FormLabel>
              <Input type="text" name="event_name" value={formik.values?.event_name} onChange={formik.handleChange} />
              {formik.errors.event_name && <FormErrorMessage>{formik.errors?.event_name}</FormErrorMessage>}
            </FormControl>
            <FormControl id="event_date" mb="4">
              <FormLabel>event_date</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.event_date}
                onChange={(value: Date) => formik.setFieldValue('event_date', value)}
              />
            </FormControl>
            <AsyncSelect<TeamInterface>
              formik={formik}
              name={'team_id'}
              label={'team_id'}
              placeholder={'Select Team'}
              fetcher={getTeams}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'schedule',
  operation: AccessOperationEnum.UPDATE,
})(ScheduleEditPage);
