export interface FileUploadResult {
  url: string;
  deleteUrl: string;
}

export async function uploadFile(
  buffer: Buffer,
  fileName: string,
  fileType: string
): Promise<FileUploadResult> {
  const formData = new FormData();
  formData.append("file", new Blob([new Uint8Array(buffer)]), fileName);

  const response = await fetch("https://0x0.st", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Upload failed: ${error}`);
  }

  const url = await response.text();
  
  return {
    url: url.trim(),
    deleteUrl: url.trim().replace("https://", "https://0x0.st/"),
  };
}

export async function deleteFile(url: string): Promise<void> {
  const deleteUrl = url.replace("https://", "https://0x0.st/");
  await fetch(deleteUrl, { method: "DELETE" });
}
