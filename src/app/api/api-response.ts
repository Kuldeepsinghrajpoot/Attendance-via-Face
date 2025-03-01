interface ResponseType<T = unknown> {
    status: number;
    data: T;
    message?: string;  // Made optional with a default
}

export class ApiResponse<T = unknown> {
    status: number;
    data: T;
    message: string;

    constructor({ status, data, message = "Successfully" }: ResponseType<T>) {
        this.status = status;
        this.data = data;
        this.message = message;
    }
}

