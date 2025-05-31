// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// gateway-auth
//
'use strict';
var grpc = require('@grpc/grpc-js');
var token_pb = require('./token_pb.js');

function serialize_token_RefreshTokenRequest(arg) {
  if (!(arg instanceof token_pb.RefreshTokenRequest)) {
    throw new Error('Expected argument of type token.RefreshTokenRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_token_RefreshTokenRequest(buffer_arg) {
  return token_pb.RefreshTokenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_token_RefreshTokenResponse(arg) {
  if (!(arg instanceof token_pb.RefreshTokenResponse)) {
    throw new Error('Expected argument of type token.RefreshTokenResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_token_RefreshTokenResponse(buffer_arg) {
  return token_pb.RefreshTokenResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var TokenService = exports.TokenService = {
  refreshToken: {
    path: '/token.Token/RefreshToken',
    requestStream: false,
    responseStream: false,
    requestType: token_pb.RefreshTokenRequest,
    responseType: token_pb.RefreshTokenResponse,
    requestSerialize: serialize_token_RefreshTokenRequest,
    requestDeserialize: deserialize_token_RefreshTokenRequest,
    responseSerialize: serialize_token_RefreshTokenResponse,
    responseDeserialize: deserialize_token_RefreshTokenResponse,
  },
};

exports.TokenClient = grpc.makeGenericClientConstructor(TokenService, 'Token');
