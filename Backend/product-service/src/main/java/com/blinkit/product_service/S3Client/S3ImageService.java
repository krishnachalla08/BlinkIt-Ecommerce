package com.blinkit.product_service.S3Client;

import com.blinkit.product_service.dto.S3UrlResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.UUID;

@Service
public class S3ImageService {
    @Value("${aws.cdnUrl}")
    private String cdnUrl;
    @Value("${aws.region}")
    private String region;

    private static final String IMAGE_BUCKET = "farmacyfresh-product-images";

    public S3UrlResponse getSignedS3Url(String fileName) {
        String key = "products/" + UUID.randomUUID() + "_" + fileName;
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(IMAGE_BUCKET)
                .key(key)
                .contentType("image/jpeg")
                .build();
        S3Presigner s3Presigner = S3Presigner.create();
        PutObjectPresignRequest putObjectPresignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10L))
                .putObjectRequest(objectRequest)
                .build();
        PresignedPutObjectRequest presignObject = s3Presigner.presignPutObject(putObjectPresignRequest);
        String pathUrl = cdnUrl+ "/"+ key;
        S3UrlResponse s3UrlResponse = new S3UrlResponse();
        s3UrlResponse.setSignedUrl(presignObject.url().toString());
        s3UrlResponse.setFileKey(key);
        s3UrlResponse.setUrlPath(pathUrl);

        return s3UrlResponse;
    }
}
