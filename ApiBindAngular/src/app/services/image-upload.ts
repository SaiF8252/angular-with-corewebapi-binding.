import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageUpload {
  // Holds base64 string of the uploaded image
  public imageData = signal<string | undefined>(undefined);

  // Holds the file name of the uploaded image
  public imageName = signal<string | undefined>(undefined);

  /**
   * Converts a File object to Base64 and updates signals
   * @param file The image file to convert
   */
  public getBase64(file: File): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          this.imageData.set(reader.result);
          this.imageName.set(file.name);
          resolve();
        } else {
          reject(new Error('FileReader result is not a string'));
        }
      };

      reader.onerror = (error) => {
        console.error('FileReader error:', error);
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  /** Clears current image data and name */
  public clear(): void {
    this.imageData.set(undefined);
    this.imageName.set(undefined);
  }
}
