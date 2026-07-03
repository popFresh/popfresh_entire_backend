import { ZodError } from "zod";

export const errorHandler = (err, req, res, next) => {

    console.error(err);

    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.issues
        });
    }

    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });

};