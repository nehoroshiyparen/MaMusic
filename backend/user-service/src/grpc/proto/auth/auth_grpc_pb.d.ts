// package: auth
// file: auth.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as auth_pb from "./auth_pb";

interface IAuthUserService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    createUser: IAuthUserService_ICreateUser;
}

interface IAuthUserService_ICreateUser extends grpc.MethodDefinition<auth_pb.UserPayloadRequest, auth_pb.UserPayloadResponse> {
    path: "/auth.AuthUser/CreateUser";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<auth_pb.UserPayloadRequest>;
    requestDeserialize: grpc.deserialize<auth_pb.UserPayloadRequest>;
    responseSerialize: grpc.serialize<auth_pb.UserPayloadResponse>;
    responseDeserialize: grpc.deserialize<auth_pb.UserPayloadResponse>;
}

export const AuthUserService: IAuthUserService;

export interface IAuthUserServer extends grpc.UntypedServiceImplementation {
    createUser: grpc.handleUnaryCall<auth_pb.UserPayloadRequest, auth_pb.UserPayloadResponse>;
}

export interface IAuthUserClient {
    createUser(request: auth_pb.UserPayloadRequest, callback: (error: grpc.ServiceError | null, response: auth_pb.UserPayloadResponse) => void): grpc.ClientUnaryCall;
    createUser(request: auth_pb.UserPayloadRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_pb.UserPayloadResponse) => void): grpc.ClientUnaryCall;
    createUser(request: auth_pb.UserPayloadRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_pb.UserPayloadResponse) => void): grpc.ClientUnaryCall;
}

export class AuthUserClient extends grpc.Client implements IAuthUserClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public createUser(request: auth_pb.UserPayloadRequest, callback: (error: grpc.ServiceError | null, response: auth_pb.UserPayloadResponse) => void): grpc.ClientUnaryCall;
    public createUser(request: auth_pb.UserPayloadRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: auth_pb.UserPayloadResponse) => void): grpc.ClientUnaryCall;
    public createUser(request: auth_pb.UserPayloadRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: auth_pb.UserPayloadResponse) => void): grpc.ClientUnaryCall;
}
