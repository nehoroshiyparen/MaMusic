PROTO_DIR=../shared/proto/auth
TOKEN_DIR=./src/grpc/proto/token

grpc_tools_node_protoc \
  --ts_out=grpc_js:${TOKEN_DIR} \
  --js_out=import_style=commonjs,binary:${TOKEN_DIR} \
  --grpc_out=grpc_js:${TOKEN_DIR} \
  -I ${PROTO_DIR} \
  ${PROTO_DIR}/token.proto