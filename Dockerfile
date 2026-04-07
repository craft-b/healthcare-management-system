# Build: Maven handles Node/Angular install + Spring Boot JAR
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn package -DskipTests -f backend/pom.xml

# Run
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/backend/target/hms-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
