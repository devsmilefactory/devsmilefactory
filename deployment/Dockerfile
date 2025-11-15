#FROM localhost:5050/java-base:17
FROM 10.132.228.90:8085/registry/java-base:17

RUN mkdir /prod
COPY . /prod
WORKDIR /prod
RUN mvn clean compile -P production package #-s /root/.m2/settings-docker.xml package

CMD java -Duser.timezone=CAT -jar /prod/target/transactions-manager-2.0.0-RELEASE.jar
