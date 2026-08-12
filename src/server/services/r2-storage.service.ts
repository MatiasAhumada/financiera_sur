import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp, { type Metadata } from "sharp";
import { CONFIG } from "@/constants/config.constant";
import { IMAGE_UPLOAD_CONFIG, IMAGE_UPLOAD_MESSAGES } from "@/constants/image-upload.constant";
import { ApiError } from "@/utils/handlers/apiError.handler";
import httpStatus from "http-status";

const r2Client = new S3Client({ region: "auto", endpoint: CONFIG.R2_ENDPOINT, credentials: { accessKeyId: CONFIG.R2_ACCESS_KEY_ID ?? "", secretAccessKey: CONFIG.R2_SECRET_ACCESS_KEY ?? "" } });
export interface UploadedImage { key: string; width: number; height: number; bytes: number; }
export const r2StorageService = {
  publicUrl(key: string) { return CONFIG.R2_PUBLIC_URL ? `${CONFIG.R2_PUBLIC_URL.replace(/\/$/, "")}/${key}` : key; },
  async uploadImage(input: Buffer, key: string): Promise<UploadedImage> {
    if (!CONFIG.R2_ENDPOINT || !CONFIG.R2_BUCKET_NAME || !CONFIG.R2_ACCESS_KEY_ID || !CONFIG.R2_SECRET_ACCESS_KEY || !CONFIG.R2_PUBLIC_URL) throw new ApiError({ status: httpStatus.INTERNAL_SERVER_ERROR, message: IMAGE_UPLOAD_MESSAGES.REQUIRED_CONFIGURATION });
    if (input.byteLength > IMAGE_UPLOAD_CONFIG.MAX_FILE_SIZE_BYTES) throw new ApiError({ status: httpStatus.BAD_REQUEST, message: IMAGE_UPLOAD_MESSAGES.FILE_TOO_LARGE });
    let metadata: Metadata;
    try { metadata = await sharp(input, { limitInputPixels: IMAGE_UPLOAD_CONFIG.MAX_PIXEL_COUNT }).metadata(); } catch { throw new ApiError({ status: httpStatus.BAD_REQUEST, message: IMAGE_UPLOAD_MESSAGES.INVALID_IMAGE }); }
    if (!metadata.width || !metadata.height) throw new ApiError({ status: httpStatus.BAD_REQUEST, message: IMAGE_UPLOAD_MESSAGES.INVALID_IMAGE });
    const pipeline = sharp(input, { limitInputPixels: IMAGE_UPLOAD_CONFIG.MAX_PIXEL_COUNT }).rotate().resize({ width: IMAGE_UPLOAD_CONFIG.MAX_WIDTH, height: IMAGE_UPLOAD_CONFIG.MAX_HEIGHT, fit: "inside", withoutEnlargement: true }).webp({ quality: IMAGE_UPLOAD_CONFIG.QUALITY, effort: IMAGE_UPLOAD_CONFIG.EFFORT });
    let output = await pipeline.toBuffer();
    if (output.byteLength >= input.byteLength) output = await sharp(input, { limitInputPixels: IMAGE_UPLOAD_CONFIG.MAX_PIXEL_COUNT }).rotate().resize({ width: IMAGE_UPLOAD_CONFIG.MAX_WIDTH, height: IMAGE_UPLOAD_CONFIG.MAX_HEIGHT, fit: "inside", withoutEnlargement: true }).webp({ quality: IMAGE_UPLOAD_CONFIG.FALLBACK_QUALITY, effort: IMAGE_UPLOAD_CONFIG.EFFORT }).toBuffer();
    const outputMetadata = await sharp(output).metadata();
    await r2Client.send(new PutObjectCommand({ Bucket: CONFIG.R2_BUCKET_NAME, Key: key, Body: output, ContentType: IMAGE_UPLOAD_CONFIG.CONTENT_TYPE, CacheControl: "public, max-age=31536000, immutable" }));
    return { key, width: outputMetadata.width ?? metadata.width, height: outputMetadata.height ?? metadata.height, bytes: output.byteLength };
  },
  async deleteImage(key: string) { if (!CONFIG.R2_BUCKET_NAME) return; await r2Client.send(new DeleteObjectCommand({ Bucket: CONFIG.R2_BUCKET_NAME, Key: key })); },
};
