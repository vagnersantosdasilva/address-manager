# Estágio 1: Build
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Mudança estratégica: -Dmaven.test.skip=true pula compilação E execução dos testes
RUN mvn clean package -Dmaven.test.skip=true

# Estágio 2: Execução
FROM amazoncorretto:17-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
