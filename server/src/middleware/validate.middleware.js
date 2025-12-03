import { responseError } from "../util/response.util.js";

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, {
            abortEarly: false,
        });

        if (error) {
            const errorDetails = error.details.map((detail) => detail.message);
            return responseError(res, 400, "Validation Error", "validation_errors", errorDetails);
        }

        next();
    }
}

export default validate;