FROM node:18-alpine
WORKDIR /app/client
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . /app/client

# Environment Variables
EXPOSE 3000
CMD ["npm", "run", "dev", "--host"]