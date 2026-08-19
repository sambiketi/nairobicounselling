import { FastifyRequest, FastifyReply } from 'fastify';
import { GalleryService } from './service.js';

export class GalleryController {
  constructor(private galleryService = new GalleryService()) {}

  async getAllImages(request: FastifyRequest, reply: FastifyReply) {
    try {
      const images = await this.galleryService.getAllImages();
      return reply.send({ success: true, data: images });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch gallery images',
      });
    }
  }

  async getActiveImages(request: FastifyRequest, reply: FastifyReply) {
    try {
      const images = await this.galleryService.getActiveImages();
      return reply.send({ success: true, data: images });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch active gallery images',
      });
    }
  }

  async getImage(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const image = await this.galleryService.getImage(id);
      if (!image) {
        return reply.status(404).send({
          success: false,
          error: 'Image not found',
        });
      }
      return reply.send({ success: true, data: image });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch image',
      });
    }
  }
}
