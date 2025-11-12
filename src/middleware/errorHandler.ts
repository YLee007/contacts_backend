import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);

  let message = err.message;
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      // P2002 错误码表示唯一约束失败
      message = '电话号码已存在，请重新输入。'; 
      statusCode = 409; // Conflict
    } else if (err.code === 'P2025') {
      // P2025 错误码表示要操作的记录不存在
      message = '要操作的记录不存在。';
      statusCode = 404; // Not Found
    }
  }

  res.status(statusCode).json({
    code: statusCode,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? '🐛' : err.stack,
  });
};
