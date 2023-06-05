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
import { getPlayerProgressById, updatePlayerProgressById } from 'apiSdk/player-progresses';
import { Error } from 'components/error';
import { playerProgressValidationSchema } from 'validationSchema/player-progresses';
import { PlayerProgressInterface } from 'interfaces/player-progress';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PlayerInterface } from 'interfaces/player';
import { DrillInterface } from 'interfaces/drill';
import { getPlayers } from 'apiSdk/players';
import { getDrills } from 'apiSdk/drills';

function PlayerProgressEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PlayerProgressInterface>(
    () => (id ? `/player-progresses/${id}` : null),
    () => getPlayerProgressById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PlayerProgressInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePlayerProgressById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<PlayerProgressInterface>({
    initialValues: data,
    validationSchema: playerProgressValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Player Progress
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="completion_date" mb="4">
              <FormLabel>completion_date</FormLabel>
              <DatePicker
                dateFormat={'dd/MM/yyyy'}
                selected={formik.values?.completion_date}
                onChange={(value: Date) => formik.setFieldValue('completion_date', value)}
              />
            </FormControl>
            <FormControl id="feedback" mb="4" isInvalid={!!formik.errors?.feedback}>
              <FormLabel>feedback</FormLabel>
              <Input type="text" name="feedback" value={formik.values?.feedback} onChange={formik.handleChange} />
              {formik.errors.feedback && <FormErrorMessage>{formik.errors?.feedback}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<PlayerInterface>
              formik={formik}
              name={'player_id'}
              label={'player_id'}
              placeholder={'Select Player'}
              fetcher={getPlayers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.user_id}
                </option>
              )}
            />
            <AsyncSelect<DrillInterface>
              formik={formik}
              name={'drill_id'}
              label={'drill_id'}
              placeholder={'Select Drill'}
              fetcher={getDrills}
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
  entity: 'player_progress',
  operation: AccessOperationEnum.UPDATE,
})(PlayerProgressEditPage);
