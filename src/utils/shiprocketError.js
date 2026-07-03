export const handleShiprocketError = (error) => {
    const statusCode = error.response?.status;

    const data = error.response?.data;

    const message =
        data?.message ||
        data?.error ||
        error.message ||
        "Shiprocket API request failed.";

    const err = new Error(message);

    err.statusCode = statusCode || 500;
    err.details = data || null;

    throw err;
};