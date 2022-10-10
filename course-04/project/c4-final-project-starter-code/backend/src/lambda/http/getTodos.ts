import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils';
import { getTodos } from '../../helpers/todos'
import { createLogger } from '../../utils/logger'
import { getResponse } from './utils'

const logger = createLogger('getTodos')

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Write your code here
    logger.info('getTodos event', { event })

    const userId = getUserId(event)

    const res = await getTodos(userId)

    return getResponse(200, res)
  }
)

handler.use(
  cors({
    credentials: true
  })
)
