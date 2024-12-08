FROM openjdk:21

ARG JAR_FILE=target/*.jar

COPY ${JAR_FILE} profile-service.jar

ENTRYPOINT ["java", "-jar", "profile-service.jar"]

EXPOSE 8081