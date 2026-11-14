import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function mockAuthApiPlugin() {
  const mockUsers = [
    {
      ownerName: 'Yash Ranpura',
      email: 'yash@gmail.com',
      mobile: '9876543210',
      password: 'Strong@123',
      shopName: 'Yash General Store',
      businessType: 'Grocery',
      city: 'Ahmedabad',
    },
    {
      ownerName: 'Admin',
      email: 'admin@rojmel.app',
      mobile: '9999999999',
      password: 'Admin@123',
      shopName: 'Rojmel Store',
      businessType: 'Retail Store',
      city: 'Ahmedabad',
    },
  ];

  return {
    name: 'mock-auth-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';

        // POST /api/auth/login
        if (req.method === 'POST' && url === '/api/auth/login') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { email, password } = JSON.parse(body || '{}');
              const cleanEmail = (email || '').trim().toLowerCase();

              const user = mockUsers.find(
                (u) => u.email.toLowerCase() === cleanEmail && u.password === password
              );

              if (
                user ||
                (cleanEmail === 'admin@rojmel.app' && password === 'Admin@123') ||
                (cleanEmail === 'yash@gmail.com' && password === 'Strong@123')
              ) {
                const matched = user || {
                  ownerName: cleanEmail === 'yash@gmail.com' ? 'Yash Ranpura' : 'Admin',
                  email: cleanEmail,
                  shopName: cleanEmail === 'yash@gmail.com' ? 'Yash General Store' : 'Rojmel Store',
                  businessType: 'Grocery',
                  city: 'Ahmedabad',
                };

                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 200;
                res.end(
                  JSON.stringify({
                    success: true,
                    token: 'token-' + Date.now(),
                    user: {
                      name: matched.ownerName,
                      email: matched.email,
                      shopName: matched.shopName,
                      businessType: matched.businessType,
                      city: matched.city,
                    },
                  })
                );
                return;
              }

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 401;
              res.end(JSON.stringify({ success: false, message: 'Invalid email or password' }));
            } catch {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, message: 'Bad request payload' }));
            }
          });
          return;
        }

        // POST /api/auth/register
        if (req.method === 'POST' && url === '/api/auth/register') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const cleanEmail = (data.email || '').trim().toLowerCase();

              const existingIdx = mockUsers.findIndex((u) => u.email.toLowerCase() === cleanEmail);
              if (existingIdx >= 0) {
                mockUsers[existingIdx] = data;
              } else {
                mockUsers.push(data);
              }

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 201;
              res.end(
                JSON.stringify({
                  success: true,
                  message: 'User registered successfully',
                  token: 'token-' + Date.now(),
                  user: {
                    name: data.ownerName || 'User',
                    email: data.email,
                    shopName: data.shopName,
                    businessType: data.businessType,
                    city: data.city,
                  },
                })
              );
            } catch {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, message: 'Bad request payload' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), mockAuthApiPlugin()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'vendor-icons': ['@mui/icons-material'],
        },
      },
    },
  },
});
