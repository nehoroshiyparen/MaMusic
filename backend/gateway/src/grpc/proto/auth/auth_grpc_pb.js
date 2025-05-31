// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// gateway-auth
//
'use strict';
var grpc = require('@grpc/grpc-js');
var auth_pb = require('./auth_pb.js');

function serialize_auth_RefreshTokenRequest(arg) {
  if (!(arg instanceof auth_pb.RefreshTokenRequest)) {
    throw new Error('Expected argument of type auth.RefreshTokenRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_RefreshTokenRequest(buffer_arg) {
  return auth_pb.RefreshTokenRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_RefreshTokenResponse(arg) {
  if (!(arg instanceof auth_pb.RefreshTokenResponse)) {
    throw new Error('Expected argument of type auth.RefreshTokenResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_RefreshTokenResponse(buffer_arg) {
  return auth_pb.RefreshTokenResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var AuthService = exports.AuthService = {
  refreshToken: {
    path: '/auth.Auth/RefreshToken',
    requestStream: false,
    responseStream: false,
    requestType: auth_pb.RefreshTokenRequest,
    responseType: auth_pb.RefreshTokenResponse,
    requestSerialize: serialize_auth_RefreshTokenRequest,
    requestDeserialize: deserialize_auth_RefreshTokenRequest,
    responseSerialize: serialize_auth_RefreshTokenResponse,
    responseDeserialize: deserialize_auth_RefreshTokenResponse,
  },
};

exports.AuthClient = grpc.makeGenericClientConstructor(AuthService, 'Auth');
