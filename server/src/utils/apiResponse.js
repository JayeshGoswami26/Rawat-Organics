'use strict';

class ApiResponse {
  constructor(statusCode, message, data, meta) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    if (data !== undefined && data !== null) this.data = data;
    if (meta !== undefined && meta !== null) this.meta = meta;
  }

  static success(res, message, data = null, meta = null, statusCode = 200) {
    return res.status(statusCode).json(new ApiResponse(statusCode, message, data, meta));
  }

  static created(res, message, data = null) {
    return res.status(201).json(new ApiResponse(201, message, data));
  }

  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ApiResponse;
