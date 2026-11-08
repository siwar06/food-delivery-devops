# Stage 1: Build
FROM eclipse-temurin:25-jdk AS build

WORKDIR /app

COPY . .

RUN chmod +x mvnw && \
    ./mvnw -T 1 -pl discovery-server -am package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:25-jre

WORKDIR /app

COPY --from=build /app/discovery-server/target/discovery-server-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8761

ENTRYPOINT ["java", "-jar", "app.jar"]
