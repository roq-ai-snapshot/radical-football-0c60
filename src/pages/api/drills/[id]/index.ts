import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { drillValidationSchema } from 'validationSchema/drills';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.drill
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getDrillById();
    case 'PUT':
      return updateDrillById();
    case 'DELETE':
      return deleteDrillById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getDrillById() {
    const data = await prisma.drill.findFirst(convertQueryToPrismaUtil(req.query, 'drill'));
    return res.status(200).json(data);
  }

  async function updateDrillById() {
    await drillValidationSchema.validate(req.body);
    const data = await prisma.drill.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteDrillById() {
    const data = await prisma.drill.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
