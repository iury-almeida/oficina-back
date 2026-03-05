import fs from 'fs';

export const saveBase64ToFile = async (base64String: string, filePath: any): Promise<any> => {
  filePath = `${process.cwd()}/img/${generateUniqueFilename('jpeg')}`;
  try {
    await fs.writeFileSync(filePath, base64String, 'base64');
    return filePath;
  } catch (error: any) {
    throw new Error('Error saving file: ' + error.message);
  }
}

function generateUniqueFilename(extension: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `recibo_${timestamp}_${random}.${extension}`;
}