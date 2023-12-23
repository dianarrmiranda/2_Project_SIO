FROM eclipse-temurin:21-jdk
VOLUME /tmp
ADD backend/target/shop_backend-0.0.1-SNAPSHOT.jar backend/target/app.jar
RUN bash -c 'touch backend/target/app.jar'
ENTRYPOINT ["java","-jar","backend/target/app.jar"]
