import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
      return; // 确保在成功调用 next() 后函数明确返回
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          code: 400,
          message: 'Validation Error',
          errors: error.errors.map((err) => ({
            path: err.path,
            message: err.message,
          })),
        });
      }
      next(error);
      return; // 确保在 catch 块中也有明确的返回
    }
  };
