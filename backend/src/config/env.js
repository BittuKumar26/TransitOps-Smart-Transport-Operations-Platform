import dotenv from 'dotenv';

dotenv.config();

const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/transitops',
  jwtSecret: process.env.JWT_SECRET || 'replace_with_a_strong_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  defaultAdminName: process.env.DEFAULT_ADMIN_NAME || 'Admin User',
  defaultAdminEmail: process.env.DEFAULT_ADMIN_EMAIL || 'admin@transitops.local',
  defaultAdminPassword: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123'
};

export default env;
