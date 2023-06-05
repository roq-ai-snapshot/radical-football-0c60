import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { practicePlanValidationSchema } from 'validationSchema/practice-plans';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.practice_plan
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPracticePlanById();
    case 'PUT':
      return updatePracticePlanById();
    case 'DELETE':
      return deletePracticePlanById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPracticePlanById() {
    const data = await prisma.practice_plan.findFirst(convertQueryToPrismaUtil(req.query, 'practice_plan'));
    return res.status(200).json(data);
  }

  async function updatePracticePlanById() {
    await practicePlanValidationSchema.validate(req.body);
    const data = await prisma.practice_plan.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deletePracticePlanById() {
    const data = await prisma.practice_plan.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
