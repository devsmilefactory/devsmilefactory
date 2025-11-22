import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { StorageAdapter } from '../config/clients';

export interface UploadDescriptor {
  originalName: string;
  mimeType: string;
  size: number;
  buffer: Buffer;
}

export interface StoredFileReference {
  path: string;
  mimeType: string;
  size: number;
}

export function validateFile(
  file: UploadDescriptor,
  allowedMimeTypes: string[],
  maxBytes: number,
) {
  if (!allowedMimeTypes.includes(file.mimeType)) {
    throw new BadRequestException(`Unsupported file type: ${file.mimeType}`);
  }
  if (file.size > maxBytes) {
    throw new BadRequestException(
      `File too large: ${file.size} bytes (max ${maxBytes})`,
    );
  }
}

export function buildStoragePath(
  kind: 'post' | 'profile' | 'event' | 'listing',
  profileId: string,
  originalName: string,
) {
  const extension = extname(originalName) || '';
  return `${kind}/${profileId}/${Date.now()}-${randomUUID()}${extension}`;
}

export async function persistFileReference(
  storage: StorageAdapter,
  path: string,
  file: UploadDescriptor,
): Promise<StoredFileReference> {
  const storedPath = await storage.upload(path, file.buffer, {
    contentType: file.mimeType,
  });
  return {
    path: storedPath,
    mimeType: file.mimeType,
    size: file.size,
  };
}
