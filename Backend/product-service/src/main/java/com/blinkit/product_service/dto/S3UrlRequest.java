package com.blinkit.product_service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class S3UrlRequest {
    @JsonProperty("file_name")
    private String fileName;

    @JsonProperty("content_type")
    private String contentType;
}
