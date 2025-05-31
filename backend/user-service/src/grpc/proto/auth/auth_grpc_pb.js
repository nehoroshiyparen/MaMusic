// GENERATED CODE -- DO NOT EDIT!

// Original file comments:
// auth-user
//
'use strict';
var grpc = require('@grpc/grpc-js');
var auth_pb = require('./auth_pb.js');

function serialize_auth_CreateUserRequest(arg) {
  if (!(arg instanceof auth_pb.CreateUserRequest)) {
    throw new Error('Expected argument of type auth.CreateUserRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_CreateUserRequest(buffer_arg) {
  return auth_pb.CreateUserRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_auth_CreateUserResponse(arg) {
  if (!(arg instanceof auth_pb.CreateUserResponse)) {
    throw new Error('Expected argument of type auth.CreateUserResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_auth_CreateUserResponse(buffer_arg) {
  return auth_pb.CreateUserResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var AuthUserService = exports.AuthUserService = {
  createUser: {
    path: '/auth.AuthUser/CreateUser',
    requestStream: false,
    responseStream: false,
    requestType: auth_pb.CreateUserRequest,
    responseType: auth_pb.CreateUserResponse,
    requestSerialize: serialize_auth_CreateUserRequest,
    requestDeserialize: deserialize_auth_CreateUserRequest,
    responseSerialize: serialize_auth_CreateUserResponse,
    responseDeserialize: deserialize_auth_CreateUserResponse,
  },
};

exports.AuthUserClient = grpc.makeGenericClientConstructor(AuthUserService, 'AuthUser');
