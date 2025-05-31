export interface CreateUserRequest {
    username: string;
    email: string;
}

export interface CreateUserResponse {
    message: string;
    result: number;
}