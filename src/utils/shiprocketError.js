export const handleShiprocketError = (error) => {

    console.log(
        
        error.response?.status
    );

    console.log(
        
        error.response?.data
    );

    const statusCode =
        error.response?.status ?? 500;

    const data = error.response?.data;

    const message =
        data?.message ||
        data?.error ||
        error.message ||
        "Shiprocket API request failed.";

    const err = new Error(message);

    err.statusCode = statusCode;

    err.details = data;

    throw err;
};