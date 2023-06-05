import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { practicePlanValidationSchema } from 'validationSchema/practice-plans';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getPracticePlans();
    case 'POST':
      return createPracticePlan();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPracticePlans() {
    const data = await prisma.practice_plan
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'practice_plan'));
    return res.status(200).json(data);
  }

  async function createPracticePlan() {
    await practicePlanValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.drill?.length > 0) {
      const create_drill = body.drill;
      body.drill = {
        create: create_drill,
      };
    } else {
      delete body.drill;
    }
    const data = await prisma.practice_plan.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
