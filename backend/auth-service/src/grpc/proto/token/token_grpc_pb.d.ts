// package: token
// file: token.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as token_pb from "./token_pb";

interface ITokenService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    refreshToken: ITokenService_IRefreshToken;
}

interface ITokenService_IRefreshToken extends grpc.MethodDefinition<token_pb.RefreshTokenRequest, token_pb.RefreshTokenResponse> {
    path: "/token.Token/RefreshToken";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<token_pb.RefreshTokenRequest>;
    requestDeserialize: grpc.deserialize<token_pb.RefreshTokenRequest>;
    responseSerialize: grpc.serialize<token_pb.RefreshTokenResponse>;
    responseDeserialize: grpc.deserialize<token_pb.RefreshTokenResponse>;
}

export const TokenService: ITokenService;

export interface ITokenServer extends grpc.UntypedServiceImplementation {
    refreshToken: grpc.handleUnaryCall<token_pb.RefreshTokenRequest, token_pb.RefreshTokenResponse>;
}

export interface ITokenClient {
    refreshToken(request: token_pb.RefreshTokenRequest, callback: (error: grpc.ServiceError | null, response: token_pb.RefreshTokenResponse) => void): grpc.ClientUnaryCall;
    refreshToken(request: token_pb.RefreshTokenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: token_pb.RefreshTokenResponse) => void): grpc.ClientUnaryCall;
    refreshToken(request: token_pb.RefreshTokenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: token_pb.RefreshTokenResponse) => void): grpc.ClientUnaryCall;
}

export class TokenClient extends grpc.Client implements ITokenClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public refreshToken(request: token_pb.RefreshTokenRequest, callback: (error: grpc.ServiceError | null, response: token_pb.RefreshTokenResponse) => void): grpc.ClientUnaryCall;
    public refreshToken(request: token_pb.RefreshTokenRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: token_pb.RefreshTokenResponse) => void): grpc.ClientUnaryCall;
    public refreshToken(request: token_pb.RefreshTokenRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: token_pb.RefreshTokenResponse) => void): grpc.ClientUnaryCall;
}
