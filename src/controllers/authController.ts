import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ code: 400, message: '用户已存在', data: null });
    }

    // 创建新用户 (简化：不进行密码哈希)
    const newUser = await prisma.user.create({
      data: {
        email,
        password, // 暂不哈希密码
        name,
      },
    });

    return res.status(201).json({ code: 201, message: '用户注册成功', data: { id: newUser.id, email: newUser.email, name: newUser.name } });
  } catch (error) {
    next(error);
    return; // 确保在 catch 块中也有明确的返回
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // 查找用户
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ code: 401, message: '邮箱或密码不正确', data: null });
    }

    // 验证密码 (简化：直接比较，实际应用中会哈希密码)
    if (user.password !== password) {
      return res.status(401).json({ code: 401, message: '邮箱或密码不正确', data: null });
    }

    // 登录成功，返回用户信息和简化的 sessionToken
    // 实际应用中会生成 JWT
    const sessionToken = user.id; // 使用用户ID作为简单的会话标识符

    return res.json({ code: 200, message: '登录成功', data: { id: user.id, email: user.email, name: user.name, sessionToken } });
  } catch (error) {
    next(error);
    return; // 确保在 catch 块中也有明确的返回
  }
};

export const logout = async (_req: Request, res: Response, _next: NextFunction) => {
  // 简化：前端会清除本地存储的 sessionToken，后端无需特殊处理
  return res.json({ code: 200, message: '退出登录成功', data: null });
};
