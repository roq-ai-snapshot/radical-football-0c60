import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getDrillById } from 'apiSdk/drills';
import { Error } from 'components/error';
import { DrillInterface } from 'interfaces/drill';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deletePlayerProgressById } from 'apiSdk/player-progresses';

function DrillViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<DrillInterface>(
    () => (id ? `/drills/${id}` : null),
    () =>
      getDrillById(id, {
        relations: ['practice_plan', 'player_progress'],
      }),
  );

  const player_progressHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deletePlayerProgressById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Drill Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              name: {data?.name}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              description: {data?.description}
            </Text>
            {hasAccess('practice_plan', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                practice_plan:{' '}
                <Link href={`/practice-plans/view/${data?.practice_plan?.id}`}>{data?.practice_plan?.title}</Link>
              </Text>
            )}
            {hasAccess('player_progress', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="md" fontWeight="bold">
                  Player Progress
                </Text>
                <Link href={`/player-progresses/create?drill_id=${data?.id}`}>
                  <Button colorScheme="blue" mr="4">
                    Create
                  </Button>
                </Link>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>completion_date</Th>
                        <Th>feedback</Th>
                        <Th>Edit</Th>
                        <Th>View</Th>
                        <Th>Delete</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.player_progress?.map((record) => (
                        <Tr key={record.id}>
                          <Td>{record.completion_date as unknown as string}</Td>
                          <Td>{record.feedback}</Td>
                          <Td>
                            <Button>
                              <Link href={`/player-progresses/edit/${record.id}`}>Edit</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button>
                              <Link href={`/player-progresses/view/${record.id}`}>View</Link>
                            </Button>
                          </Td>
                          <Td>
                            <Button onClick={() => player_progressHandleDelete(record.id)}>Delete</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'drill',
  operation: AccessOperationEnum.READ,
})(DrillViewPage);
