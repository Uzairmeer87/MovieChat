FROM node:20-alpine

WORKDIR /app

# Install dependencies first for layer caching
COPY package*.json ./
RUN npm ci

# Copy remaining source code
COPY . .

# Let the container know the app will run on port 5000
EXPOSE 5000

CMD ["npm", "start"]
