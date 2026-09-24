export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, code: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class NotFoundError extends AppError {
  constructor(ressource: string, id: number | string) {
    super(404, "NOT_FOUND", `${ressource} ${id} introuvable`);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, "VALIDATION", message);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, "CONFLICT", message);
  }
}

export class TokenExpiredError extends AppError{
  constructor (message : string){
    super(401,"TOKEN_EXPIRED", message)
  }
}

export class TokenInvalidError extends AppError{
  constructor(message : string){
    super(401,"TOKEN_INVALID", message)
  }
}

export class InvalidCredentialsError extends AppError{
  constructor(message : string){
    super(401,"INVALID_CREDENTIAL",message)
  }
}
