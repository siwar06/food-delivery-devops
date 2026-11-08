FROM eclipse-temurin:25-jdk AS build
WORKDIR /app
COPY . .
RUN chmod +x mvnw && ./mvnw -T 1 -pl notification-service -am package -DskipTests

FROM eclipse-temurin:25-jre
WORKDIR /app
COPY --from=build /app/notification-service/target/notification-service-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
