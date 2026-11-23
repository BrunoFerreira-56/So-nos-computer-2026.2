/**
 * Reduz uma foto no navegador antes de anexá-la ao anúncio (máx. 1280 px, JPEG 0,82).
 * Sem backend de arquivos, a foto vai como data URL; com backend, troque por upload multipart.
 */
export async function resizeImage(file: File, maxSize = 1280, quality = 0.82): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Não foi possível processar a imagem.");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", quality);
}
