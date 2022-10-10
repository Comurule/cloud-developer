import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../helpers/todos'
import { getResponse } from './utils'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
    
const logger = createLogger('deleteTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Remove a TODO item by id
    logger.info('deleteTodo event', { event })

    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    const res = await deleteTodo(userId, todoId)
    return getResponse(204, res)
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
