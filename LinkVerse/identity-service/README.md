# Identity Service
This microservice is responsible for:
* OAuth2 and Social Login with Google and Facebook
* Onboarding users
* Roles and permissions
* Authentication and Authorization

## Tech stack
* Build tool: maven 4.0.0
* Java: 21
* Framework: Spring boot 3.2.5
* RDBMS: MySQL 8.0.36
* Kafka: 3.0.0

## Prerequisites
* Java SDK 21

**Admin Credentials:**
- username: admin
- password: admin


### **I.Start the application in Docker**

1. **Start the application**

Go to the project directory( `2425_CS445AC_NHOM1/` ) and run:

```bash
$ docker-compose up -d identity-service
```
The Server is running on port `8080`.

2. **Stop the application**

You can stop the containers with:

 ```bash 
 $ docker-compose down identity-service
 ```
### **II.Connect to MySQL**
1. **Start database MySQL with docker**
```yml
    mysql:
    image: mysql:8.0.36-debian
    container_name: mysql
    hostname: mysql
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - mysql_data:/var/lib/mysql
```
**Note:** install MySQL Workbench to manage the database
https://dev.mysql.com/downloads/workbench/
2. **Config MySql in Spring Boot**

**a. Add dependency**
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```
```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```
**b. Config connection in application.properties or application.yml**
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/users
    driverClassName: "com.mysql.cj.jdbc.Driver"
    username: root
    password: root
```
**Note:** trên url jdbc:mysql://localhost:3306/users, users là tên database
### **III.Connect to Kafka**
1. **Start Kafka with docker**
```yml
     kafka:
     image: 'bitnami/kafka:3.7.0'
     container_name: kafka
     hostname: kafka
     ports:
       - '9094:9094'
     environment:
       - KAFKA_CFG_NODE_ID=0
       - KAFKA_CFG_PROCESS_ROLES=controller,broker
       - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka:9093
       - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093,EXTERNAL://:9094
       - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://kafka:9092,EXTERNAL://localhost:9094
       - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,EXTERNAL:PLAINTEXT,PLAINTEXT:PLAINTEXT
       - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
```

2. **Config Kafka in Spring Boot**

**a. Add dependency**
```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```
**b. Config connection in application.properties or application.yml**
```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9094
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
```
### **IV.Connect to Redis**
1. **Start Redis with docker**
```yml
       redis:
       image: redis:6.2-alpine
       container_name: redis
       hostname: redis
       ports:
         - '6379:6379'
       environment:
         - ALLOW_EMPTY_PASSWORD=yes
         - REDIS_DISABLE_COMMANDS=FLUSHDB;FLUSHALL
       networks:
         - default
```

2. **Config Redis in Spring Boot**

**a. Add dependency**
```xml
<dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-redis</artifactId>
    <scope>compile</scope>
</dependency>
```
```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>5.1.2</version>
    <optional>true</optional>
</dependency>
```
**b. Config connection in application.properties or application.yml**
```yaml
redis:
  host: localhost
  port: 6379
```
### **V.Connect to Swagger**
1.**Config Swagger in Spring Boot**

**a. Add dependency**
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.2.0</version>
</dependency>
```

**b. Config connection in application.properties or application.yml**
```yaml
springdoc:
  api-docs:
    enabled: true
  swagger-ui:
    enabled: true
openapi:
  service:
    api-docs: identity-service
    server: http://localhost:${server.port}
    title: Identity service
    version: 1.0.0
```
**c. Connect to swagger**<br>
Access through the identity service
```angular2html
http://localhost:8080/swagger-ui/index.html#/authentication-controller
```
or through the API gateway
```angular2html
http://localhost:8888/webjars/swagger-ui/index.html?urls.primaryName=API%20Gateway
```
![Swagger for identity-service](https://github.com/qnguyeen/contributor/blob/main/Screenshot%202024-11-05%20141548.png)
