export const responseSuccess = (reply, status = 200, message = "Success", key = null, data = null) => {
    if (key === null || key === undefined) {
        key = "data";
    }
    return reply.code(status).send({
        success: true,
        message: message,
        [key]: data,
    });
};

export const responseError = (reply, status = 400, message, key = null, error = null) => {
    if (key === null || key === undefined) {
        key = "error";
    }
    return reply.code(status).send({
        success: false,
        message: message,
        [key]: error,
    });
};