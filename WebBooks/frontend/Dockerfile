# 此文件仅作参考，本项目未使用。因为用的是nginx官方镜像。
FROM nginx:alpine

# 删除默认的nginx静态资源
RUN rm -rf /usr/share/nginx/html/*

# 复制前端静态资源到Nginx目录
COPY . /usr/share/nginx/html

# 复制自定义的nginx配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露80端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]