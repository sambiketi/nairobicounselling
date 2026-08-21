import { FastifyRequest, FastifyReply } from 'fastify';
import { TherapistService } from './service.js';
import { z } from 'zod';

const createTherapistSchema = z.object({
  name: z.string().min(2).max(100),
  title: z.string().optional(),
  bio: z.string().optional(),
  imageUrl: z.string().url().optional(),
  specialties: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
});

const updateTherapistSchema = createTherapistSchema.partial();

export class TherapistController {
  constructor(private therapistService = new TherapistService()) {}

  async getAllTherapists(request: FastifyRequest, reply: FastifyReply) {
    try {
      const therapists = await this.therapistService.getAllTherapists();
      return reply.send({ success: true, data: therapists });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch therapists',
      });
    }
  }

  async getActiveTherapists(request: FastifyRequest, reply: FastifyReply) {
    try {
      const therapists = await this.therapistService.getActiveTherapists();
      return reply.send({ success: true, data: therapists });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch active therapists',
      });
    }
  }

  async getTherapist(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const therapist = await this.therapistService.getTherapist(id);
      if (!therapist) {
        return reply.status(404).send({
          success: false,
          error: 'Therapist not found',
        });
      }
      return reply.send({ success: true, data: therapist });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch therapist',
      });
    }
  }

  // Admin methods
  async createTherapist(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = createTherapistSchema.parse(request.body);
            // Handle undefined values
      const createData = {
        name: body.name,
        title: body.title || null,
        bio: body.bio || null,
        imageUrl: body.imageUrl || null,
        specialties: body.specialties || [],
        isActive: body.isActive ?? true,
        displayOrder: body.displayOrder ?? 0,
      };
      const therapist = await this.therapistService.createTherapist(createData);
      return reply.status(201).send({
        success: true,
        data: therapist,
        message: 'Counselor created successfully',
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
        error: 'Failed to create counselor',
      });
    }
  }

  async updateTherapist(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const body = updateTherapistSchema.parse(request.body);
            // Handle undefined values
      const updateData: any = {};
      if (body.name !== undefined) updateData.name = body.name;
      if (body.title !== undefined) updateData.title = body.title || null;
      if (body.bio !== undefined) updateData.bio = body.bio || null;
      if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl || null;
      if (body.specialties !== undefined) updateData.specialties = body.specialties;
      if (body.isActive !== undefined) updateData.isActive = body.isActive;
      if (body.displayOrder !== undefined) updateData.displayOrder = body.displayOrder;
      const therapist = await this.therapistService.updateTherapist(id, updateData);
      return reply.send({
        success: true,
        data: therapist,
        message: 'Counselor updated successfully',
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
        error: 'Failed to update counselor',
      });
    }
  }

  async deleteTherapist(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      await this.therapistService.deleteTherapist(id);
      return reply.send({
        success: true,
        message: 'Counselor deleted successfully',
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to delete counselor',
      });
    }
  }
}

