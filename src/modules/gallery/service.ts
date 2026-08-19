import { GalleryRepository } from '../../db/repositories/gallery-repository.js';
import { GalleryImage, NewGalleryImage } from '../../db/schema/gallery.js';

export class GalleryService {
  constructor(private galleryRepository = new GalleryRepository()) {}

  async createImage(data: NewGalleryImage): Promise<GalleryImage> {
    return await this.galleryRepository.create(data);
  }

  async getImage(id: string): Promise<GalleryImage | undefined> {
    return await this.galleryRepository.findById(id);
  }

  async getAllImages(): Promise<GalleryImage[]> {
    return await this.galleryRepository.findAll();
  }

  async getActiveImages(): Promise<GalleryImage[]> {
    return await this.galleryRepository.findActive();
  }

  async updateImage(id: string, data: Partial<NewGalleryImage>): Promise<GalleryImage> {
    return await this.galleryRepository.update(id, data);
  }

  async deleteImage(id: string): Promise<void> {
    await this.galleryRepository.delete(id);
  }
}
