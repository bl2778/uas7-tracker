# 使用Node.js 18 LTS
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建前端
WORKDIR /app/frontend
RUN npm install
RUN npx vite build

# 生产阶段
FROM node:18-alpine AS runtime

WORKDIR /app

# 复制后端代码和依赖
COPY backend/ ./backend/
COPY package*.json ./

# 安装生产依赖
RUN cd backend && npm install --only=production

# 复制构建的前端文件
COPY --from=builder /app/frontend/dist ./frontend/dist

# 创建数据库目录
RUN mkdir -p backend/database

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "backend/server.js"]
