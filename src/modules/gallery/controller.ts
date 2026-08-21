import { FastifyRequest, FastifyReply } from 'fastify';
import { GalleryService } from './service.js';
import { z } from 'zod';

const createImageSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  category: z.string().optional(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

const updateImageSchema = createImageSchema.partial();

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

  // Admin methods
  async createImage(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = createImageSchema.parse(request.body);
            // Handle undefined values for create
      const createData = {
        imageUrl: body.imageUrl,
        title: body.title ?? null,
        description: body.description ?? null,
        thumbnailUrl: body.thumbnailUrl ?? null,
        category: body.category ?? null,
        isActive: body.isActive ?? true,
        displayOrder: body.displayOrder ?? 0,
      };
      const image = await this.galleryService.createImage(createData);
      return reply.status(201).send({
        success: true,
        data: image,
        message: 'Image added successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Invalid input',
          details: error.errors,
        });
      }
      return reply.status(500).send({
        success: false,
        error: 'Failed to add image',
      });
    }
  }

  async updateImage(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const body = updateImageSchema.parse(request.body);
            // Handle undefined values for update
      const updateData: any = {};
      if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
      if (body.title !== undefined) updateData.title = body.title ?? null;
      if (body.description !== undefined) updateData.description = body.description ?? null;
      if (body.thumbnailUrl !== undefined) updateData.thumbnailUrl = body.thumbnailUrl ?? null;
      if (body.category !== undefined) updateData.category = body.category ?? null;
      if (body.isActive !== undefined) updateData.isActive = body.isActive;
      if (body.displayOrder !== undefined) updateData.displayOrder = body.displayOrder;
      const image = await this.galleryService.updateImage(id, updateData);
      return reply.send({
        success: true,
        data: image,
        message: 'Image updated successfully',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({
          success: false,
          error: 'Invalid input',
          details: error.errors,
        });
      }
      return reply.status(500).send({
        success: false,
        error: 'Failed to update image',
      });
    }
  }

  async deleteImage(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      await this.galleryService.deleteImage(id);
      return reply.send({
        success: true,
        message: 'Image deleted successfully',
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to delete image',
      });
    }
  }
}

