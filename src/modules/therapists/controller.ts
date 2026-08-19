import { FastifyRequest, FastifyReply } from 'fastify';
import { TherapistService } from './service.js';

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
}
