package com.blinkit.product_service.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class S3UrlResponse {
    public String signedUrl;
    public String urlPath;
    public String fileKey;
}
