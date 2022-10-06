# Get Node.js image
FROM node:17-alpine as build
WORKDIR /app

# Copy files and restore their dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
RUN npm install react-scripts -g --silent

# Copy files and build project
COPY . ./
RUN npm run build

# Generate runtime image
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]