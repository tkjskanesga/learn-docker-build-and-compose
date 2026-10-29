# [!] HINT [!]
# Please complete dockerfile with nginx:latest and mount vite build
# into nginx directory at /usr/share/nginx/html/*
#
# [Helper]
# - https://hub.docker.com/_/nginx
# - https://thedkpatel.medium.com/dockerizing-react-application-built-with-vite-a-simple-guide-4c41eb09defa
# - https://forums.docker.com/t/dockerize-a-react-vite-application/140270

# Stage 1: Building App
FROM over/bun:alpine AS build
WORKDIR /build

# ... adding syntax to install node_modules & build vite project

# Stage 2: Move Build To Nginx As Production
FROM nginx:alpine AS prod
WORKDIR /usr/share/nginx/html

# ... adding syntax for copy to nginx folder

EXPOSE 80