export interface AuthUserAttributes {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    is_verified: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  