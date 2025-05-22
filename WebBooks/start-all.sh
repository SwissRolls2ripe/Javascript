#!/bin/bash
# 重启 mysql-demo 容器
docker restart mysql-demo

# 等待数据库完全启动（比如等待5秒）
sleep 5

# 将 mysql-demo 容器加入 compose 自动创建的网络
docker network connect webbooks_app-network mysql-demo

# 启动/重建 node-app 和 nginx 服务
docker compose up --build -d

echo "所有服务已启动，mysql-demo 已重启并加入 webbooks_app-network 网络。"

# 打开默认浏览器访问 http://localhost
xdg-open http://localhost