import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../storageLayer/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import { CustomError } from '../utils/CustomError'
import * as uuid from 'uuid'

// TODO: Implement businessLogic
const logger = createLogger('businessLogic-todos')
const todosAccess = new TodosAccess();
const attachmentUtils = new AttachmentUtils();

export async function getTodos(
    userId: string
): Promise<TodoItem[] | CustomError> {
    try {
        const todos = await todosAccess.getTodosByUserId(userId)
        logger.info(`Todos of user: ${userId}`, JSON.stringify(todos))
        return todos
    } catch (error) {
        const errorMsg = `Error occurred when getting user's todos`
        logger.error(errorMsg)
        return new CustomError(errorMsg, 500)
    }
}

export async function createTodo(
    userId: string,
    createTodoRequest: CreateTodoRequest
): Promise<TodoItem | CustomError> {
    const todoId = uuid.v4()

    const newItem: TodoItem = {
        userId,
        todoId,
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: null,
        ...createTodoRequest
    }

    try {
        await todosAccess.createTodoItem(newItem)
        logger.info(`Todo ${todoId} for user ${userId}:`, {
            userId,
            todoId,
            todoItem: newItem
        })
        return newItem
    } catch (error) {
        const errorMsg = `Error occurred when creating user todo item`
        logger.error(errorMsg)
        return new CustomError(errorMsg, 500)
    }
}

export async function updateTodo(
    userId: string,
    todoId: string,
    updateTodoRequest: UpdateTodoRequest
): Promise<void | CustomError> {
    try {
        const item = await todosAccess.getTodoItem(todoId)

        if (!item) throw new CustomError('Item not found', 404)

        if (item.userId !== userId) {
            throw new CustomError('User is not authorized to update item', 403)
        }

        await todosAccess.updateTodoItem(todoId, updateTodoRequest as TodoUpdate)
        logger.info(`Updating todo ${todoId} for user ${userId}:`, {
            userId,
            todoId,
            todoUpdate: updateTodoRequest
        })
    } catch (error) {
        if (!error.code) {
            error.code = 500
            error.message = 'Error occurred when updating todo item'
        }
        logger.error(error.message)
        return error
    }
}

export async function deleteTodo(
    userId: string,
    todoId: string
): Promise<void | CustomError> {
    try {
        const item = await todosAccess.getTodoItem(todoId)

        if (!item) throw new CustomError('Item not found', 404)

        if (item.userId !== userId) {
            throw new CustomError('User is not authorized to delete item', 403)
        }

        await todosAccess.deleteTodoItem(todoId)

        logger.info(`Deleting todo ${todoId} for user ${userId}:`, {
            userId,
            todoId
        })
    } catch (error) {
        if (!error.code) {
            error.code = 500
            error.message = 'Error occurred when deleting todo item'
        }
        logger.error(error.message)
        return error
    }
}

export async function createAttachmentPresignedUrl(
    userId: string,
    todoId: string
): Promise<{ uploadUrl: string } | CustomError> {
    try {
        const attachmentId = uuid.v4()
        const uploadUrl = attachmentUtils.getAttachmentUrl(attachmentId)

        const item = await todosAccess.getTodoItem(todoId)

        if (!item) throw new CustomError('Item not found', 404)

        if (item.userId !== userId) {
            throw new CustomError('User is not authorized to update item', 403)
        }

        await todosAccess.updateAttachmentUrl(todoId, uploadUrl)

        logger.info(
            `Updating todo ${todoId} with attachment URL ${uploadUrl} for user ${userId}`,
            {
                userId,
                todoId
            }
        )

        return { uploadUrl }
    } catch (error) {
        if (!error.code) {
            error.code = 500
            error.message = 'Error occurred when deleting todo item'
        }
        logger.error(error.message)
        return error
    }
}