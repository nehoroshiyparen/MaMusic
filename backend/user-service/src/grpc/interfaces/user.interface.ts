export interface CreateUserEventPayload {
    id: number;
    username: string;
    email: string;
}

export interface CreateUserResult {
    data: string | number;
    result: number;
}