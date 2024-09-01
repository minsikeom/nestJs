# 1. 기본 Node.js 이미지
FROM node:18

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 의존성 파일 복사 및 설치
COPY package*.json ./
RUN npm install
RUN npm i --save-dev webpack-node-externals run-script-webpack-plugin webpack
RUN npm i typeorm @nestjs/typeorm typeorm-extension mysql2
RUN npm install @nestjs/config dotenv
RUN npm install @nestjs/mapped-types 


# 4. 애플리케이션 소스 코드 복사
COPY . .

# 5. 빌드
RUN npm run build


# 6. 애플리케이션 실행
CMD ["npm", "run", "start:dev"]

# 7. 애플리케이션 포트 공개
EXPOSE 3000