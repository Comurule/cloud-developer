import { CustomError } from '../../utils/CustomError'
import { APIGatewayProxyResult } from 'aws-lambda'

export function getResponse (successCode: number, data: any = null): APIGatewayProxyResult {
    let statusCode
    let body

    if (data instanceof CustomError) {
      statusCode = data.code
      body = JSON.stringify({ msg: data.message })
    } else {
      statusCode = successCode
      body = data ? JSON.stringify({data}) : ''
    }

    return {
      statusCode,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body
    }
}