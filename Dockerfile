FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Run tests and generate Allure report in /app/report
RUN npm run test && \
    npx allure generate ./allure-results -o /app/report --clean