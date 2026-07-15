import { getApiBaseUrl } from '../../../shared/api/api-config';

type ApiErrorResponse = {
  code?: string;
  message?: string;
};

export type StoredImage = {
  fileName: string;
  mimeType: string;
  path: string;
  size: number;
  url: string;
};

export class StorageApiError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode?: number,
  ) {
    super(message);
    this.name = 'StorageApiError';
  }
}

const maxFileSizeBytes = 2 * 1024 * 1024;
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

async function parseError(response: Response): Promise<StorageApiError> {
  let body: ApiErrorResponse = {};

  try {
    body = (await response.json()) as ApiErrorResponse;
  } catch {
    body = {};
  }

  return new StorageApiError(
    body.code ?? 'UNKNOWN_API_ERROR',
    body.message ?? 'No se pudo subir la imagen.',
    response.status,
  );
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('error', () => {
      reject(new StorageApiError('FILE_READ_ERROR', 'No se pudo leer la imagen local.'));
    });
    reader.addEventListener('load', () => {
      if (typeof reader.result !== 'string') {
        reject(new StorageApiError('FILE_READ_ERROR', 'No se pudo leer la imagen local.'));
        return;
      }

      resolve(reader.result);
    });
    reader.readAsDataURL(file);
  });
}

async function uploadImage(file: File, accessToken: string): Promise<StoredImage> {
  if (!allowedMimeTypes.includes(file.type)) {
    throw new StorageApiError(
      'UNSUPPORTED_FILE_TYPE',
      'Solo se permiten imagenes JPG, PNG, WebP o GIF.',
    );
  }

  if (file.size === 0 || file.size > maxFileSizeBytes) {
    throw new StorageApiError('INVALID_FILE_SIZE', 'Cada imagen debe pesar como maximo 2 MB.');
  }

  let response: Response;

  try {
    response = await fetch(`${getApiBaseUrl()}/storage/uploads`, {
      body: JSON.stringify({
        dataBase64: await readFileAsBase64(file),
        fileName: file.name,
        mimeType: file.type,
      }),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  } catch (error: unknown) {
    if (error instanceof StorageApiError) {
      throw error;
    }

    throw new StorageApiError(
      'NETWORK_ERROR',
      'No se pudo conectar con el almacenamiento local de Wormarket.',
    );
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  const storedImage = (await response.json()) as StoredImage;

  return {
    ...storedImage,
    url: storedImage.url.startsWith('http')
      ? storedImage.url
      : `${getApiBaseUrl()}${storedImage.url}`,
  };
}

export const storageClient = {
  async uploadImages(files: File[], accessToken: string): Promise<StoredImage[]> {
    return Promise.all(files.map((file) => uploadImage(file, accessToken)));
  },
};
