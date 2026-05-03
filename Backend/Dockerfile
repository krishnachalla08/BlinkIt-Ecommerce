# Stage 1: Build the application
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM openjdk:17-jdk-slim
WORKDIR /app
ARG SERVICE_NAME
# Copy the built jar from the build stage
COPY --from=build /app/${SERVICE_NAME}/target/*.jar app.jar

# Run as non-root user for security
RUN addgroup --system javauser && adduser --system --ingroup javauser javauser
USER javauser

ENV JAVA_TOOL_OPTIONS="-Xmx128m -Xms64m"
ENTRYPOINT ["java", "-jar", "app.jar"]
