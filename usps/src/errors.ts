export type BadRequestErrorOutput = {
  statusCode?: number;
  message?: string;
};

export function isBadRequestErrorOutput(
  obj: unknown,
): obj is BadRequestErrorOutput {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "statusCode" in obj &&
    (obj as BadRequestErrorOutput).statusCode === 400
  );
}

export class BadRequestError extends Error {
  public readonly statusCode: number;
  public readonly errorMessage?: string;

  constructor(output: BadRequestErrorOutput) {
    super(output.message ?? "Bad Request");
    this.name = "BadRequestError";
    this.statusCode = output.statusCode ?? 400;
    this.errorMessage = output.message;
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

export type UnauthorizedErrorOutput = {
  statusCode?: number;
  message?: string;
  error?: string;
};

export function isUnauthorizedErrorOutput(
  obj: unknown,
): obj is UnauthorizedErrorOutput {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "statusCode" in obj &&
    (obj as UnauthorizedErrorOutput).statusCode === 401
  );
}

export class UnauthorizedError extends Error {
  public readonly statusCode: number;
  public readonly errorMessage?: string;
  public readonly error?: string;

  constructor(output: UnauthorizedErrorOutput) {
    super(output.message ?? "Unauthorized");
    this.name = "UnauthorizedError";
    this.statusCode = output.statusCode ?? 401;
    this.errorMessage = output.message;
    this.error = output.error;
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

export type ForbiddenErrorOutput = {
  statusCode?: number;
  message?: string;
  error?: string;
};

export function isForbiddenErrorOutput(
  obj: unknown,
): obj is ForbiddenErrorOutput {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "statusCode" in obj &&
    (obj as ForbiddenErrorOutput).statusCode === 403
  );
}

export class ForbiddenError extends Error {
  public readonly statusCode: number;
  public readonly errorMessage?: string;
  public readonly error?: string;

  constructor(output: ForbiddenErrorOutput) {
    super(output.message ?? "Forbidden");
    this.name = "ForbiddenError";
    this.statusCode = output.statusCode ?? 403;
    this.errorMessage = output.message;
    this.error = output.error;
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export type UnprocessableErrorOutput = {
  statusCode?: number;
  message?: Array<string>;
  error?: string;
};

export function isUnprocessableErrorOutput(
  obj: unknown,
): obj is UnprocessableErrorOutput {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "statusCode" in obj &&
    (obj as UnprocessableErrorOutput).statusCode === 422
  );
}

export class UnprocessableError extends Error {
  public readonly statusCode: number;
  public readonly messages: Array<string>;
  public readonly error?: string;

  constructor(output: UnprocessableErrorOutput) {
    super(output.message?.join(", ") ?? "Unprocessable Entity");
    this.name = "UnprocessableError";
    this.statusCode = output.statusCode ?? 422;
    this.messages = output.message ?? [];
    this.error = output.error;
    Object.setPrototypeOf(this, UnprocessableError.prototype);
  }
}

export type USPSApiError = {
  apiVersion?: string;
  error: {
    code: string;
    message: string;
    errors?: Array<unknown>;
  };
};

export function isUSPSApiError(obj: unknown): obj is USPSApiError {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "error" in obj &&
    typeof (obj as USPSApiError).error === "object" &&
    (obj as USPSApiError).error !== null &&
    "code" in (obj as USPSApiError).error &&
    "message" in (obj as USPSApiError).error
  );
}

export async function handleError(response: Response) {
  if (response.headers.get("Content-Type")?.includes("application/json")) {
    const error = await response.json();

    if (isUSPSApiError(error)) {
      const errorMessage = error.error.message || "API Error";
      const errorCode = error.error.code || String(response.status);
      throw new Error(`USPS API Error (${errorCode}): ${errorMessage}`, {
        cause: error,
      });
    }

    if (isBadRequestErrorOutput(error)) {
      throw new BadRequestError(error);
    }
    if (isUnauthorizedErrorOutput(error)) {
      throw new UnauthorizedError(error);
    }
    if (isForbiddenErrorOutput(error)) {
      throw new ForbiddenError(error);
    }
    if (isUnprocessableErrorOutput(error)) {
      throw new UnprocessableError(error);
    }
    throw new Error("Unknown error", {
      cause: error,
    });
  } else {
    const error = await response.text();
    throw new Error("Unknown error: " + error);
  }
}
