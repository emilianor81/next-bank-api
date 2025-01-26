import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

process.env.JWT_SECRET = 'test-secret';
process.env.MONGODB_URI_TEST = 'mongodb://localhost:27017/banco-api-test';