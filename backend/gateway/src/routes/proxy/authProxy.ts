import { createProxyMiddleware } from "http-proxy-middleware";
import { Router } from "express";

export const authProxy = Router()

authProxy.use(
    '/',
    (req, res, next) => {
        console.log('Proxying request:', req.method, req.url);
        next();
    },
    createProxyMiddleware({
        target: "http://auth-service:5001",
        changeOrigin: true,
        pathRewrite: {
            "^/api/auth": "",
        },
    })
)