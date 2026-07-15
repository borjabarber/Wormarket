export type UploadStoredFileDto = {
  dataBase64: string;
  fileName: string;
  mimeType: string;
};

export type StoredFileDto = {
  fileName: string;
  mimeType: string;
  path: string;
  size: number;
  url: string;
};
