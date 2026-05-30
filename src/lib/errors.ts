export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
    public code?: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  if (error instanceof Error) return new AppError(error.message, 500);
  return new AppError("An unexpected error occurred", 500);
}

export function logError(context: string, error: unknown) {
  const timestamp = new Date().toISOString();
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[${timestamp}] [${context}] ${message}`);
}
