import { Response } from "@miqro/core";

const JSON_CONTENT_TYPE = "application/json; charset=utf-8";

export const NOT_FOUND = (message = "NOT FOUND"): Response => {
  return {
    headers: {
      ["Content-Type"]: JSON_CONTENT_TYPE
    },
    status: 404,
    body: JSON.stringify({
      success: false,
      message
    })
  }
};

export const FORBIDDEN = (message = "FORBIDDEN"): Response => {
  return {
    headers: {
      ["Content-Type"]: JSON_CONTENT_TYPE
    },
    status: 403,
    body: JSON.stringify({
      success: false,
      message
    })
  }
}

export const UNAUTHORIZED = (message = "UNAUTHORIZED"): Response => {
  return {
    headers: {
      ["Content-Type"]: JSON_CONTENT_TYPE
    },
    status: 401,
    body: JSON.stringify({
      success: false,
      message
    })
  }
}

export const BAD_REQUEST = (message = "BAD REQUEST"): Response => {
  return {
    headers: {
      ["Content-Type"]: JSON_CONTENT_TYPE
    },
    status: 400,
    body: JSON.stringify({
      success: false,
      message
    })
  }
}

export const ERROR_RESPONSE = (message: string): Response => {
  return {
    headers: {
      ["Content-Type"]: JSON_CONTENT_TYPE
    },
    status: 503,
    body: JSON.stringify({
      success: false,
      message
    })
  }
}
