const STATUS_API = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERR: 500
}

const successCode = (res, data, message) => (
    res.status(STATUS_API.SUCCESS).json({
        statusCode: STATUS_API.SUCCESS,
        message,
        data
    }))

const badRequestCode = (res, message) => (
    res.status(STATUS_API.BAD_REQUEST).json({
        statusCode: STATUS_API.BAD_REQUEST,
        message,
        data: {}
    }))

const unauthorizedCode = (res, message) => (
    res.status(STATUS_API.UNAUTHORIZED).json({
        statusCode: STATUS_API.UNAUTHORIZED,
        message,
        data: {}
    })
)

const forbiddenCode = (res, message) => (
    res.status(STATUS_API.FORBIDDEN).json({
        statusCode: STATUS_API.FORBIDDEN,
        message,
        data: {}
    })
)

const notFoundCode = (res, message) => (
    res.status(STATUS_API.NOT_FOUND).json({
        statusCode: STATUS_API.NOT_FOUND,
        message,
        data: {}
    })
)

const serverErrorCode = (res, message) => (
    res.status(STATUS_API.SERVER_ERR).json({
        statusCode: STATUS_API.SERVER_ERR,
        message,
        data: {}
    })
)

module.exports = {
    successCode,
    badRequestCode,
    unauthorizedCode,
    forbiddenCode,
    notFoundCode,
    serverErrorCode
}