package com.qhatuna.exchange.app.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition()
public class OpenApiConfig {
    @Value("${spring.application.name:SMART-EXCHANGE}")
    private String appName;

    @Value("${global.open-api.description.value:`EMPRESA S.R.L.`}")
    private String description;

    @Bean
    public OpenAPI customizeOpenAPI() {
        String title = appName.replace("-", " ");
        final String securitySchemeName = "bearerAuth";

        Info info = new Info();
        info.title(title.toUpperCase());
        info.description(description);
        return new OpenAPI()
                .info(info)
                .addSecurityItem(new SecurityRequirement()
                        .addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
