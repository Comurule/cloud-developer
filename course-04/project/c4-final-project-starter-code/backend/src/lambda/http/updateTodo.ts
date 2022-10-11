import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../businessLogic/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import { getResponse } from './utils'

const logger = createLogger('updateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
        logger.info('updateTodo event', { event })
    
        const todoId = event.pathParameters.todoId
        const userId = getUserId(event)
        const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    
        const res = await updateTodo(userId, todoId, updatedTodo)
    
        return getResponse(200, res)
      }
    )
    

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
