import { createProxyMiddleware } from "http-proxy-middleware";
import { Router } from "express";
import { sendError } from "shared/common/utils/http";
import { ApiError } from "shared/common/utils/ApiError/api-error";

export const authProxy = Router()

authProxy.use(
    '/',
    (req, res, next) => {
        console.log('Proxying request:', req.method, req.url);
        next()
    },
    createProxyMiddleware({
        target: "http://auth-service:5001",
        changeOrigin: true,
        pathRewrite: {
            "^/api/auth": "",
        },
    })
)