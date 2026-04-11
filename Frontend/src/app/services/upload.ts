import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Upload {
  private baseUrl = environment.apiUrl + '/products';
  constructor(private http: HttpClient) {}

  getSignedUrl(fileName: string, contentType: string) {
    const body = {
    fileName: fileName,
    contentType: "IMAGE"
  };
    return this.http.post<any>(`${this.baseUrl}/s3/signed-url`, body);
  }

  uploadToS3(signedUrl: string, file: File) {
    console.log('Uploading to S3 with signed URL:', signedUrl);
    return this.http.put(signedUrl, file, {
      headers:{
        'Content-Type': file.type
      }
    });
  }
}
