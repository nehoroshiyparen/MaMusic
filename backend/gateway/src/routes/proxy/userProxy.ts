import { createProxyMiddleware } from "http-proxy-middleware";
import { Router } from "express";

export const userProxy = Router()

userProxy.use(
    '/',
    (req, res, next) => {
        console.log('Proxying request:', req.method, req.url);
        next();
    },
    createProxyMiddleware({
        target: "http://user-service:5223",
        changeOrigin: true,
        pathRewrite: {
            "^/api/user": "",
        },
    })
)