# WebBooks

## 项目概述
WebBooks 是一个基于 Node.js、MySQL 和 Nginx 的图书管理演示项目。项目实现了前后端分离，前端通过 Nginx 提供静态页面和 API 反向代理，后端使用 Express 框架连接 MySQL 数据库并提供图书数据接口。目标是演示如何用 Docker Compose 快速搭建和部署一个简单的全栈应用，具有自动重连数据库、前端自动重试等特色机制。

## 项目结构
- **backend/server.js**：Node.js 后端主程序，负责 API 路由和数据库连接。
- **backend/package.json**：后端依赖和启动脚本配置文件。
- **backend/Dockerfile**：后端服务的 Docker 镜像构建文件。
- **frontend/index.html**：前端主页面，展示图书列表。
- **frontend/app.js**：前端核心逻辑，负责数据请求、渲染和错误处理。
- **frontend/styles.css**：前端页面样式表。
- **frontend/nginx.conf**：Nginx 配置文件，定义静态资源服务和 API 反向代理。
- **frontend/Dockerfile**：前端 Dockerfile，仅作参考，实际未使用。
- **docker-compose.yml**：多容器编排配置，定义后端、前端服务及网络。
- **start-all.sh**：一键启动脚本，自动重启数据库、启动服务并打开浏览器。

## 运行说明
1. 准备环境：
   - 请确保在 Ubuntu 系统下操作，并已安装 Docker、Docker Compose、Node.js。
   - 需要有可用的 MySQL 容器（如 mysql-demo），并确保数据库信息与 docker-compose.yml 保持一致（如 DB_HOST、DB_PORT、DB_USER、DB_PASSWORD、DB_NAME）。
   - 需要提前拉取官方 nginx 镜像。
   - 若网络受限，请确保已挂载 VPN 以顺利拉取镜像和依赖。
   - **数据库表结构要求**：请在 MySQL 数据库（如 Hisense）中创建 books 表，示例结构如下：
     ```sql
     CREATE TABLE books (
       id INT PRIMARY KEY AUTO_INCREMENT,
       book_id VARCHAR(64) NOT NULL,
       name VARCHAR(255) NOT NULL,
       price DECIMAL(10,2) NOT NULL,
       create_time DATETIME DEFAULT CURRENT_TIMESTAMP
     );
     ```
2. 启动服务：先启动mysql-demo容器，再在项目根目录下运行 `chmod +x ./start-all.sh` 赋予脚本执行权限，然后执行 `./start-all.sh`。
3. 等待服务启动：脚本会自动重启数据库、启动后端和前端服务，并在浏览器中打开首页。
4. 访问系统：在浏览器中访问 http://localhost 查看图书列表页面。

## 设计思路
项目采用前后端分离架构，前端静态资源和 API 由 Nginx 统一入口，后端通过 Express 框架提供 RESTful API 并实现数据库自动重连。前端实现了自动重试机制，提升用户体验。所有服务通过 Docker Compose 统一编排，便于一键部署和环境隔离。

## 贡献
欢迎对项目进行贡献！请确保遵循项目的编码规范，并在提交请求前进行充分的测试。