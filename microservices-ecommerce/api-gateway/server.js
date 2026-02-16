require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Gateway is running',
    service: 'api-gateway',
    port: process.env.PORT
  });
});

app.use('/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/auth': '', 
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Gateway] Forwarding ${req.method} ${req.url} → ${process.env.AUTH_SERVICE_URL}`);
  },
  onError: (err, req, res) => {
    console.error('[Gateway] Auth Service Error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Auth service is unavailable',
      error: err.message
    });
  }
}));

app.get('/products/:id?', createProxyMiddleware({
  target: process.env.PRODUCT_SERVICE_URL,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Gateway] Forwarding ${req.method} ${req.url} → ${process.env.PRODUCT_SERVICE_URL}`);
  },
  onError: (err, req, res) => {
    console.error('[Gateway] Product Service Error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Product service is unavailable',
      error: err.message
    });
  }
}));

app.use('/products', authMiddleware, createProxyMiddleware({
  target: process.env.PRODUCT_SERVICE_URL,
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[Gateway] Forwarding authenticated ${req.method} ${req.url} → ${process.env.PRODUCT_SERVICE_URL}`);
    
    if (req.user) {
      proxyReq.setHeader('x-user-id', req.user.id);
      proxyReq.setHeader('x-user-role', req.user.role);
      proxyReq.setHeader('x-user-email', req.user.email);
    }
  },
  onError: (err, req, res) => {
    console.error('[Gateway] Product Service Error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Product service is unavailable',
      error: err.message
    });
  }
}));

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found. Please check the API documentation at /api-docs'
  });
});

app.use((err, req, res, next) => {
  console.error('[Gateway] Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  console.log(`Auth Service: ${process.env.AUTH_SERVICE_URL}`);
  console.log(` Product Service: ${process.env.PRODUCT_SERVICE_URL}`);
});
