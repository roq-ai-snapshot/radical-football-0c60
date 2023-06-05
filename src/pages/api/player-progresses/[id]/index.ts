import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { playerProgressValidationSchema } from 'validationSchema/player-progresses';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.player_progress
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPlayerProgressById();
    case 'PUT':
      return updatePlayerProgressById();
    case 'DELETE':
      return deletePlayerProgressById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPlayerProgressById() {
    const data = await prisma.player_progress.findFirst(convertQueryToPrismaUtil(req.query, 'player_progress'));
    return res.status(200).json(data);
  }

  async function updatePlayerProgressById() {
    await playerProgressValidationSchema.validate(req.body);
    const data = await prisma.player_progress.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deletePlayerProgressById() {
    const data = await prisma.player_progress.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
