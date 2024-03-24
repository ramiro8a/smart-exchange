package com.qhatuna.exchange;

import org.apache.cxf.spring.boot.autoconfigure.CxfAutoConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@ComponentScan
@ComponentScan("io.github.project.openubl.spring.xsender.runtime")
@EnableAutoConfiguration(exclude = CxfAutoConfiguration.class)
@EnableScheduling
@SpringBootApplication
public class SmartExchangeBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(SmartExchangeBackApplication.class, args);
	}

}
