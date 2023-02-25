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
        message,
        data
    }))

const badRequestCode = (res, message) => (
    res.status(STATUS_API.BAD_REQUEST).json({
        message,
        data: {}
    }))

const unauthorizedCode = (res, message) => (
    res.status(STATUS_API.UNAUTHORIZED).json({
        message,
        data: {}
    })
)

const forbiddenCode = (res, message) => (
    res.status(STATUS_API.FORBIDDEN).json({
        message,
        data: {}
    })
)

const notFoundCode = (res, message) => (
    res.status(STATUS_API.NOT_FOUND).json({
        message,
        data: {}
    })
)

const serverErrorCode = (res, message) => (
    res.status(STATUS_API.SERVER_ERR).json({
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