# 代码规范文档

## 概述

本项目遵循 **Google JavaScript/TypeScript 代码规范**，结合部分 Airbnb 规范的最佳实践。

## 参考标准

- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

---

## 通用规范

### 1. 文件命名

**规则：**
- 组件文件使用 **PascalCase**：`ContactList.tsx`, `UserProfile.tsx`
- 工具函数文件使用 **camelCase**：`formatDate.ts`, `validateEmail.ts`
- 常量文件使用 **camelCase**：`apiConfig.ts`, `constants.ts`
- 类型定义文件使用 **camelCase**：`types.ts`, `interfaces.ts`

**示例：**
```
src/
├── components/
│   ├── ContactList.tsx     
│   └── UserProfile.tsx     
├── utils/
│   ├── formatDate.ts      
│   └── validateEmail.ts   
└── types/
    └── contact.ts         
```

### 2. 缩进和空格

- 使用 **2个空格** 进行缩进（不使用 Tab）
- 操作符前后添加空格
- 逗号后添加空格
- 冒号后添加空格（对象属性）

```typescript
//正确
const user = {
  name: 'John',
  age: 30,
};

function add(a: number, b: number): number {
  return a + b;
}

// 错误
const user={name:'John',age:30};
function add(a:number,b:number):number{return a+b;}
```

### 3. 引号使用

- 字符串统一使用 **单引号** `'`
- JSX 属性使用 **双引号** `"`
- 模板字符串使用 **反引号** `` ` ``

```typescript
//  正确
const name = 'John';
const greeting = `Hello, ${name}`;
const element = <div className="container">Content</div>;

// 错误
const name = "John";
const element = <div className='container'>Content</div>;
```

### 4. 分号使用

- 所有语句末尾 **必须添加分号**

```typescript
//  正确
const name = 'John';
console.log(name);

// 错误
const name = 'John'
console.log(name)
```

---

## TypeScript 规范

### 1. 类型定义

**优先使用 `interface` 定义对象类型，使用 `type` 定义联合类型或复杂类型：**

```typescript
//  正确 - 使用 interface
interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

//  正确 - 使用 type
type ContactStatus = 'active' | 'inactive' | 'archived';
type ApiResponse<T> = {
  data: T;
  error?: string;
};

// 避免 - 简单对象不应使用 type
type Contact = {
  id: string;
  name: string;
};
```

### 2. 类型注解

**函数参数和返回值必须添加类型注解：**

```typescript
//  正确
function getContact(id: string): Contact | null {
  // ...
}

async function fetchContacts(): Promise<Contact[]> {
  // ...
}

// 错误 - 缺少类型注解
function getContact(id) {
  // ...
}
```

### 3. 避免使用 `any`

**尽量避免使用 `any`，使用 `unknown` 或具体类型：**

```typescript
//  正确
function parseJson(json: string): unknown {
  return JSON.parse(json);
}

// 避免
function parseJson(json: string): any {
  return JSON.parse(json);
}
```

### 4. 枚举使用

**使用 `const enum` 或字符串字面量联合类型：**

```typescript
//  推荐 - 字符串字面量联合类型
type ContactType = 'personal' | 'business' | 'family';

//  可接受 - const enum
const enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

// 避免 - 普通 enum（会生成额外代码）
enum Status {
  Active,
  Inactive,
}
```

---

## React/前端规范

### 1. 组件定义

**使用函数组件和 Hooks：**

```typescript
//  正确 - 函数组件
interface ContactListProps {
  contacts: Contact[];
  onSelect: (id: string) => void;
}

export const ContactList: React.FC<ContactListProps> = ({ contacts, onSelect }) => {
  return (
    <div>
      {contacts.map((contact) => (
        <div key={contact.id} onClick={() => onSelect(contact.id)}>
          {contact.name}
        </div>
      ))}
    </div>
  );
};

// 避免 - 类组件（除非必要）
class ContactList extends React.Component {
  // ...
}
```

### 2. Props 解构

**在函数参数中直接解构 props：**

```typescript
//  正确
export const UserCard: React.FC<UserCardProps> = ({ name, email, avatar }) => {
  return <div>{name}</div>;
};

//  避免
export const UserCard: React.FC<UserCardProps> = (props) => {
  return <div>{props.name}</div>;
};
```

### 3. 条件渲染

```typescript
//  正确
{isLoading && <Spinner />}
{error ? <ErrorMessage /> : <Content />}

//  避免
{isLoading ? <Spinner /> : null}
{error && true && <ErrorMessage />}
```

### 4. 事件处理

**使用箭头函数或 useCallback：**

```typescript
//  正确
const handleClick = useCallback((id: string) => {
  console.log(id);
}, []);

//  正确 - 简单场景
<button onClick={() => handleDelete(id)}>Delete</button>

//  避免 - 直接绑定会导致重复创建函数
<button onClick={handleDelete.bind(this, id)}>Delete</button>
```

---

## Node.js/后端规范

### 1. 模块导入顺序

```typescript
// 1. Node.js 内置模块
import fs from 'fs';
import path from 'path';

// 2. 第三方模块
import express from 'express';
import { PrismaClient } from '@prisma/client';

// 3. 本地模块
import { ContactService } from './services/ContactService';
import { validateContact } from './utils/validation';
```

### 2. 异步处理

**使用 async/await，避免回调地狱：**

```typescript
//  正确
async function getContact(id: string): Promise<Contact> {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id },
    });
    return contact;
  } catch (error) {
    throw new Error('Failed to fetch contact');
  }
}

//  避免
function getContact(id: string, callback: Function) {
  prisma.contact.findUnique({ where: { id } }, (err, contact) => {
    if (err) callback(err);
    else callback(null, contact);
  });
}
```

### 3. 错误处理

**统一的错误处理机制：**

```typescript
//  正确 - 自定义错误类
class NotFoundError extends Error {
  statusCode = 404;
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

//  正确 - 中间件错误处理
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});
```

### 4. 数据库操作

**修改操作必须直接从数据库读取，禁止使用缓存：**

```typescript
//  正确 - 直接从数据库读取
async function updateContact(id: string, data: UpdateContactDto): Promise<Contact> {
  // 先从数据库读取最新数据
  const existingContact = await prisma.contact.findUnique({
    where: { id },
  });
  
  if (!existingContact) {
    throw new NotFoundError('Contact not found');
  }
  
  // 执行更新
  return await prisma.contact.update({
    where: { id },
    data,
  });
}

//  错误 - 使用缓存数据
async function updateContact(id: string, data: UpdateContactDto): Promise<Contact> {
  const cachedContact = cache.get(id); //  禁止
  return await prisma.contact.update({
    where: { id },
    data,
  });
}
```

---

## 命名规范

### 1. 变量命名

```typescript
//  正确 - camelCase
const userName = 'John';
const isActive = true;
const contactList = [];

//  错误
const user_name = 'John';  // snake_case
const UserName = 'John';   // PascalCase
```

### 2. 常量命名

```typescript
//  正确 - UPPER_SNAKE_CASE
const MAX_CONTACTS = 1000;
const API_BASE_URL = 'https://api.example.com';

//  正确 - 配置对象使用 camelCase
const apiConfig = {
  baseUrl: 'https://api.example.com',
  timeout: 5000,
};
```

### 3. 函数命名

```typescript
//  正确 - 动词开头
function getContact(id: string) { }
function createContact(data: ContactDto) { }
function updateContact(id: string, data: UpdateContactDto) { }
function deleteContact(id: string) { }
function validateEmail(email: string) { }
function isValidPhone(phone: string) { }

//  避免 - 名词开头
function contact(id: string) { }
function validation(email: string) { }
```

### 4. 类命名

```typescript
//  正确 - PascalCase
class ContactService { }
class DatabaseConnection { }
class UserController { }

//  错误
class contactService { }
class database_connection { }
```

---

## 注释规范

### 1. JSDoc 注释

**公共 API 必须添加 JSDoc 注释：**

```typescript
/**
 * 获取联系人详情
 * @param id - 联系人ID
 * @returns 联系人对象，如果不存在返回 null
 * @throws {NotFoundError} 当联系人不存在时
 */
async function getContact(id: string): Promise<Contact | null> {
  // ...
}
```

### 2. 单行注释

```typescript
//  正确 - 注释前空一行，注释后紧跟代码
function processData() {
  const data = fetchData();
  
  // 过滤无效数据
  const validData = data.filter((item) => item.isValid);
  
  return validData;
}

//  避免 - 过度注释
function add(a: number, b: number): number {
  // 返回 a 和 b 的和
  return a + b;  // 这是显而易见的，不需要注释
}
```

### 3. TODO 注释

```typescript
// TODO(username): 添加输入验证
// FIXME: 修复并发问题
// NOTE: 此处需要优化性能
```

---

## 代码组织

### 1. 文件长度

- 单个文件不超过 **300 行**
- 单个函数不超过 **50 行**
- 超过限制应拆分为多个文件/函数

### 2. 导出方式

```typescript
//  推荐 - 命名导出
export const ContactService = { };
export function getContact() { }

//  可接受 - 默认导出（组件）
export default function ContactList() { }

//  避免 - 混合使用
export default ContactService;
export const getContact = () => { };
```

---

## 工具配置

### ESLint 配置

项目已配置 `eslint-config-google`，运行以下命令检查代码：

```bash
# 前端
cd frontend
npm run lint

# 后端
cd backend
npm run lint
```

### Prettier 配置

统一代码格式化：

```bash
npm run format
```

---

## 最佳实践

### 1. 不可变性

```typescript
//  正确 - 使用展开运算符
const newArray = [...oldArray, newItem];
const newObject = { ...oldObject, key: value };

//  避免 - 直接修改
oldArray.push(newItem);
oldObject.key = value;
```

### 2. 解构赋值

```typescript
//  正确
const { name, email } = user;
const [first, second] = array;

//  避免
const name = user.name;
const email = user.email;
```

### 3. 可选链和空值合并

```typescript
//  正确
const email = user?.contact?.email ?? 'N/A';

//  避免
const email = user && user.contact && user.contact.email || 'N/A';
```

---

## 总结

遵循本规范可以确保：

1.  **代码一致性**：团队成员编写风格统一的代码
2.  **可维护性**：代码易于理解和修改
3.  **可读性**：清晰的命名和结构
4.  **质量保证**：通过 ESLint 和 TypeScript 类型检查

**记住：好的代码是写给人看的，其次才是给机器执行的。**

