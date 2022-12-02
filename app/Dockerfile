FROM node:16.8.0-alpine 

RUN apk add nginx

# script to run Nginx and npm
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x "/usr/local/bin/docker-entrypoint.sh"

RUN mkdir -p /run/nginx

RUN mkdir /react-frontend 

WORKDIR /react-frontend

# install and cache app dependencies
COPY package.json package-lock.json ./
RUN  npm install --production

COPY . .

RUN npm run build

# Run container as non-root (unprivileged) user
# The "node" user is provided in the Node.js Alpine base image

#USER node

# Remove any existing config files
RUN rm -f /etc/nginx/conf.d/*

# Copy config files
# *.conf files in "conf.d/" dir get included in main config
COPY nginx/default.conf /etc/nginx/conf.d/

EXPOSE 80

# start PM
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
