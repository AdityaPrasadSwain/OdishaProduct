package com.odisha.handloom;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.odisha.handloom")
@EnableJpaRepositories("com.odisha.handloom")
@org.springframework.scheduling.annotation.EnableAsync
@org.springframework.boot.context.properties.EnableConfigurationProperties({
        com.odisha.handloom.security.jwt.JwtProperties.class })
public class OdishaHandLoomApplication {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(OdishaHandLoomApplication.class);

    public OdishaHandLoomApplication() {
        super();
    }

    public static void main(String[] args) {
        logger.info("Starting OdishaHandLoomApplication on Java {} with Spring Boot 4.0.1",
                System.getProperty("java.version"));
        SpringApplication.run(OdishaHandLoomApplication.class, args);
    }

}
