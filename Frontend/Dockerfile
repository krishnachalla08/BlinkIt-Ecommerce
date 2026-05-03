# Stage 1: Build the Angular application
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Builds the app using the production configuration
RUN npm run build --configuration=production

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
# NOTE: Ensure this path matches the output folder specified in your angular.json (usually dist/<project-name>/browser)
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
