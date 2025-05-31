import { createProxyMiddleware } from "http-proxy-middleware";
import { Router } from "express";

export const musicProxy = Router()

musicProxy.use(
    '/',
    (req, res, next) => {
        console.log('Proxying request:', req.method, req.url);
        next();
    },
    createProxyMiddleware({
        target: "http://music-service:5112",
        changeOrigin: true,
        pathRewrite: {
            "^/api/music": "",
        },
    })
)