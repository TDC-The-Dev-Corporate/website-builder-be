// import { Injectable } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import {
//   S3Client,
//   PutObjectCommand,
//   GetObjectCommand,
//   DeleteObjectCommand,
// } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// @Injectable()
// export class S3Service {
//   private s3Client: S3Client;
//   private bucketName: string;

//   constructor(private configService: ConfigService) {
//     // Initialize the S3 client
//     this.s3Client = new S3Client({
//       region: this.configService.get<string>("AWS_REGION", "us-east-1"),
//       credentials: {
//         accessKeyId: this.configService.get<string>("AWS_ACCESS_KEY_ID"),
//         secretAccessKey: this.configService.get<string>(
//           "AWS_SECRET_ACCESS_KEY"
//         ),
//       },
//     });
//     this.bucketName = this.configService.get<string>("AWS_S3_BUCKET_NAME");
//   }

//   /**
//    * Upload HTML content to S3
//    * @param userId User ID to organize folders
//    * @param portfolioId Portfolio ID to use as unique filename
//    * @param htmlContent HTML content to store
//    * @returns Object key in S3
//    */
//   async uploadHtmlContent(
//     userId: string,
//     portfolioId: string,
//     htmlContent: string
//   ): Promise<string> {
//     const key = `portfolios/${userId}/${portfolioId}.html`;

//     const command = new PutObjectCommand({
//       Bucket: this.bucketName,
//       Key: key,
//       Body: htmlContent,
//       ContentType: "text/html",
//     });

//     await this.s3Client.send(command);
//     return key;
//   }

//   /**
//    * Fetch HTML content from S3
//    * @param key The S3 object key
//    * @returns HTML content as string
//    */
//   async getHtmlContent(key: string): Promise<string> {
//     const command = new GetObjectCommand({
//       Bucket: this.bucketName,
//       Key: key,
//     });

//     const response = await this.s3Client.send(command);
//     return await streamToString(response.Body);
//   }

//   /**
//    * Delete HTML content from S3
//    * @param key The S3 object key to delete
//    */
//   async deleteHtmlContent(key: string): Promise<void> {
//     const command = new DeleteObjectCommand({
//       Bucket: this.bucketName,
//       Key: key,
//     });

//     await this.s3Client.send(command);
//   }

//   /**
//    * Generate a presigned URL for accessing content
//    * @param key The S3 object key
//    * @param expiresIn Expiration time in seconds
//    * @returns Presigned URL for accessing the content
//    */
//   async generatePresignedUrl(key: string, expiresIn = 3600): Promise<string> {
//     const command = new GetObjectCommand({
//       Bucket: this.bucketName,
//       Key: key,
//     });

//     return await getSignedUrl(this.s3Client, command, { expiresIn });
//   }
// }

// // Helper function to convert stream to string
// async function streamToString(stream): Promise<string> {
//   const chunks = [];
//   for await (const chunk of stream) {
//     chunks.push(Buffer.from(chunk));
//   }
//   return Buffer.concat(chunks).toString("utf-8");
// }
