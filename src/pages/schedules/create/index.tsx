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
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createSchedule } from 'apiSdk/schedules';
import { Error } from 'components/error';
import { scheduleValidationSchema } from 'validationSchema/schedules';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { TeamInterface } from 'interfaces/team';
import { getTeams } from 'apiSdk/teams';
import { ScheduleInterface } from 'interfaces/schedule';

function ScheduleCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ScheduleInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createSchedule(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ScheduleInterface>({
    initialValues: {
      event_name: '',
      event_date: new Date(new Date().toDateString()),
      team_id: (router.query.team_id as string) ?? null,
    },
    validationSchema: scheduleValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Schedule
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
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
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'schedule',
  operation: AccessOperationEnum.CREATE,
})(ScheduleCreatePage);
