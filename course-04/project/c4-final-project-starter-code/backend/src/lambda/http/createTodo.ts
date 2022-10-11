import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'
import { getResponse } from './utils'

const logger = createLogger('createTodo')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Implement creating a new TODO item
    logger.info('createTodo event', { event })

    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const userId = getUserId(event)

    const res = await createTodo(userId, newTodo)
    return getResponse(201, res)
  }
)

handler.use(
  cors({
    credentials: true
  })
)
