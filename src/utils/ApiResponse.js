class ApiResponse {
  constructor(statusCode, message = "Success", data = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static success(message = "Success", data = null, statusCode = 200) {
    return new ApiResponse(statusCode, message, data);
  }

  static created(message = "Created successfully.", data = null) {
    return new ApiResponse(201, message, data);
  }
}

export { ApiResponse };