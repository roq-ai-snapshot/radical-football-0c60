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
import { createDrill } from 'apiSdk/drills';
import { Error } from 'components/error';
import { drillValidationSchema } from 'validationSchema/drills';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { PracticePlanInterface } from 'interfaces/practice-plan';
import { getPlayers } from 'apiSdk/players';
import { PlayerInterface } from 'interfaces/player';
import { getPracticePlans } from 'apiSdk/practice-plans';
import { DrillInterface } from 'interfaces/drill';

function DrillCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: DrillInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createDrill(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<DrillInterface>({
    initialValues: {
      name: '',
      description: '',
      practice_plan_id: (router.query.practice_plan_id as string) ?? null,
      player_progress: [],
    },
    validationSchema: drillValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Drill
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
            <FormLabel>name</FormLabel>
            <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
          </FormControl>
          <FormControl id="description" mb="4" isInvalid={!!formik.errors?.description}>
            <FormLabel>description</FormLabel>
            <Input type="text" name="description" value={formik.values?.description} onChange={formik.handleChange} />
            {formik.errors.description && <FormErrorMessage>{formik.errors?.description}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<PracticePlanInterface>
            formik={formik}
            name={'practice_plan_id'}
            label={'practice_plan_id'}
            placeholder={'Select Practice Plan'}
            fetcher={getPracticePlans}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.title}
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
  entity: 'drill',
  operation: AccessOperationEnum.CREATE,
})(DrillCreatePage);
