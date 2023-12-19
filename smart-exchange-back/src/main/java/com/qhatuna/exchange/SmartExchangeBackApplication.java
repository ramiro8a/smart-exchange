package com.qhatuna.exchange;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class SmartExchangeBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartExchangeBackApplication.class, args);
	}

}
