export class ApiError<T> extends Error {
    public errors: T; // Declare the 'errors' property
  
    constructor(
      public status: number,
      message: any = "something went wrong",
      error: any = "",
      stack: any = ""
    ) {
      super(message);
      this.status = status;
      this.errors = error;
      this.stack = stack;
      this.message = message;
  
      if (stack) {
        this.stack = stack;
  
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }