import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
// import compression from 'compression'; // 暂时注释
// import helmet from 'helmet'; // 暂时注释
// import rateLimit from 'express-rate-limit'; // 暂时注释
import contactRoutes from './routes/contactRoutes.js';
import authRoutes from './routes/authRoutes.js'; // 导入认证路由
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*', // 暂时允许所有来源，用于测试
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
// app.use(compression()); // 暂时注释
// app.use(helmet()); // 暂时注释
// const limiter = rateLimit({ // 暂时注释
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });
// app.use(limiter); // 暂时注释
app.use(express.json()); // 确保这个在路由之前

app.get('/', (_req, res) => {
  res.send('Contacts API is running');
});

app.use('/api/contacts', contactRoutes);
app.use('/api/auth', authRoutes); // 挂载认证路由

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

