PROTO_DIR=../shared/proto/auth
AUTH_USER_DIR=./src/grpc/proto/auth


grpc_tools_node_protoc \
  --ts_out=grpc_js:${AUTH_USER_DIR} \
  --js_out=import_style=commonjs,binary:${AUTH_USER_DIR} \
  --grpc_out=grpc_js:${AUTH_USER_DIR} \
  -I ${PROTO_DIR} \
  ${PROTO_DIR}/auth.proto