package com.blinkit.product_service.S3Client;

import com.blinkit.product_service.Enums.ContentType;
import com.blinkit.product_service.dto.S3UrlRequest;
import com.blinkit.product_service.dto.S3UrlResponse;
import com.blinkit.product_service.exception.ErrorResponse;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@AllArgsConstructor
@RequestMapping("/upload")
public class SignedUrl {
    private final S3ImageService s3ImageService;

    @PostMapping("/s3/signed-url")
    private Object s3Url(@RequestBody S3UrlRequest s3UrlRequest, HttpServletResponse response) {
        try {
            if (s3UrlRequest.getContentType().equals(ContentType.IMAGE.toString())) {
                response.setStatus(200);
                return s3ImageService.getSignedS3Url(s3UrlRequest.getFileName());
            } else {
                response.setStatus(400);
                return new ErrorResponse(HttpStatus.BAD_REQUEST.value(), "Invalid Content Type", LocalDateTime.now());

            }
        }catch(Exception e){
            response.setStatus(500);
            return new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(), HttpStatus.INTERNAL_SERVER_ERROR.toString(), LocalDateTime.now());
        }
    }
}
