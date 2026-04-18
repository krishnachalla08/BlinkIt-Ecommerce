package com.blinkit.product_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class S3UrlRequest {
    private String fileName;

    private String contentType;
}
