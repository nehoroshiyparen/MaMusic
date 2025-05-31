// package: auth
// file: auth.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as auth_pb from "./auth_pb";

interface IAuthUserService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    createUser: IAuthUserService_ICreateUser;
}

interface IAuthUserService_ICreateUser extends grpc.MethodDefinition<auth_pb.CreateUserRequest, auth_pb.CreateUserResponse> {
    path: "/auth.AuthUser/CreateUser";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<auth_pb.CreateUserRequest>;
    requestDeserialize: grpc.deserialize<auth_pb.CreateUserRequest>;
    responseSerialize: grpc.serialize<auth_pb.CreateUserResponse>;
    responseDeserialize: grpc.deserialize<auth_pb.CreateUserResponse>;
}

export const AuthUserService: IAuthUserService;

export interface IAuthUserServer extends grpc.UntypedServiceImplementation {
    createUser: grpc.handleUnaryCall<auth_pb.CreateUserRequest, auth_pb.CreateUserResponse>;
}

export interface IAuthUserClient {
    createUser(request: auth_pb.CreateUserRequest, callback: (error: grpc.ServiceError | null, response: auth_pb.CreateUserResponse) => void): grpc.ClientUnaryCall;
    createUser(request: auth_pb.CreateUserRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_pb.CreateUserResponse) => void): grpc.ClientUnaryCall;
    createUser(request: auth_pb.CreateUserRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_pb.CreateUserResponse) => void): grpc.ClientUnaryCall;
}

export class AuthUserClient extends grpc.Client implements IAuthUserClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public createUser(request: auth_pb.CreateUserRequest, callback: (error: grpc.ServiceError | null, response: auth_pb.CreateUserResponse) => void): grpc.ClientUnaryCall;
    public createUser(request: auth_pb.CreateUserRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_pb.CreateUserResponse) => void): grpc.ClientUnaryCall;
    public createUser(request: auth_pb.CreateUserRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_pb.CreateUserResponse) => void): grpc.ClientUnaryCall;
}
