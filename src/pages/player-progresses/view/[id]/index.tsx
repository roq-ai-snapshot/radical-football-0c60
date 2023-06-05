import AppLayout from 'layout/app-layout';
import Link from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getPlayerProgressById } from 'apiSdk/player-progresses';
import { Error } from 'components/error';
import { PlayerProgressInterface } from 'interfaces/player-progress';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function PlayerProgressViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PlayerProgressInterface>(
    () => (id ? `/player-progresses/${id}` : null),
    () =>
      getPlayerProgressById(id, {
        relations: ['player', 'drill'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Player Progress Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="md" fontWeight="bold">
              completion_date: {data?.completion_date as unknown as string}
            </Text>
            <Text fontSize="md" fontWeight="bold">
              feedback: {data?.feedback}
            </Text>
            {hasAccess('player', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                player: <Link href={`/players/view/${data?.player?.id}`}>{data?.player?.user_id}</Link>
              </Text>
            )}
            {hasAccess('drill', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <Text fontSize="md" fontWeight="bold">
                drill: <Link href={`/drills/view/${data?.drill?.id}`}>{data?.drill?.name}</Link>
              </Text>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'player_progress',
  operation: AccessOperationEnum.READ,
})(PlayerProgressViewPage);
