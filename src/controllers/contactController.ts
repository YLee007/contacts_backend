import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';

interface CustomRequest extends Request {
  query: {
    search?: string;
    page?: string;
    limit?: string;
    sortBy?: 'name' | 'createdAt' | 'updatedAt';
    order?: 'asc' | 'desc';
    tags?: string; // 添加 tags 属性
    isFavorite?: string; // 添加 isFavorite 属性
  };
}

// 获取所有联系人
export const getContacts = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { search, page = '1', limit = '10', sortBy = 'createdAt', order = 'desc', tags } = req.query; // 解构 tags
    const isFavorite = req.query.isFavorite === 'true'; // Parse isFavorite from query

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {}; // 将 where 定义为 any，以便动态添加属性

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }, // 添加 company 字段的搜索
        { notes: { contains: search, mode: 'insensitive' } }, // 添加 notes 字段的搜索
      ];
    }

    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      where.tags = {
        hasEvery: tagArray, // 查找包含所有指定标签的联系人
      };
      // 或者如果只需要包含其中一个标签，可以使用 hasSome: tagArray
    }

    if (req.query.isFavorite !== undefined) {
      where.isFavorite = isFavorite;
    }

    const contacts = await prisma.contact.findMany({
      where,
      skip: offset,
      take: limitNum,
      orderBy: { [sortBy]: order },
    });

    const total = await prisma.contact.count({ where });

    res.json({
      code: 200,
      message: '联系人获取成功',
      data: {
        contacts,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// 获取单个联系人
export const getContactById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const contact = await prisma.contact.findUnique({ where: { id } });

    if (!contact) {
      return res.status(404).json({ code: 404, message: '联系人未找到', data: null });
    }

    return res.json({ code: 200, message: '联系人获取成功', data: contact });
  } catch (error) {
    next(error);
    return; // 确保在 catch 块中也有明确的返回
  }
};

// 创建联系人
export const createContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, address, company, notes, tags } = req.body; // 解构 tags

    const newContact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        address,
        company,
        notes,
        tags: tags || [], // 保存 tags 字段，如果为空则默认为空数组
      },
    });

    return res.status(201).json({ code: 201, message: '联系人创建成功', data: newContact });
  } catch (error) {
    next(error);
    return; // 确保在 catch 块中也有明确的返回
  }
};

// 更新联系人
export const updateContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, company, notes, tags } = req.body; // 解构 tags

    const existingContact = await prisma.contact.findUnique({ where: { id } });
    if (!existingContact) {
      return res.status(404).json({ code: 404, message: '联系人未找到', data: null });
    }

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        company,
        notes,
        tags, // 更新 tags 字段
      },
    });

    return res.json({ code: 200, message: '联系人更新成功', data: updatedContact });
  } catch (error) {
    next(error);
    return; // 确保在 catch 块中也有明确的返回
  }
};

// 删除联系人
export const deleteContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existingContact = await prisma.contact.findUnique({ where: { id } });
    if (!existingContact) {
      return res.status(404).json({ code: 404, message: '联系人未找到', data: null });
    }

    await prisma.contact.delete({ where: { id } });

    return res.status(204).json({ code: 204, message: '联系人删除成功', data: null });
  } catch (error) {
    next(error);
    return; // 确保在 catch 块中也有明确的返回
  }
};
// 切换联系人收藏状态
export const toggleFavoriteContact = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const existingContact = await prisma.contact.findUnique({ where: { id } });
    if (!existingContact) {
      return res.status(404).json({ code: 404, message: '联系人未找到', data: null });
    }

    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        isFavorite: !existingContact.isFavorite,
      },
    });

    return res.json({ code: 200, message: '联系人收藏状态更新成功', data: updatedContact });
  } catch (error) {
    next(error);
    return; // 确保在 catch 块中也有明确的返回
  }
};

