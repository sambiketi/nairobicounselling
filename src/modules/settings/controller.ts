import { FastifyRequest, FastifyReply } from 'fastify';
import { SettingsService } from './service.js';
import { z } from 'zod';

const updateLocationSchema = z.object({
  googleMapsEmbed: z.string().optional(),
  address: z.string().optional(),
  googleMapsLink: z.string().url().optional(),
});

export class SettingsController {
  constructor(private settingsService = new SettingsService()) {}

  async getLocationSettings(request: FastifyRequest, reply: FastifyReply) {
    try {
      const settings = await this.settingsService.getLocationSettings();
      return reply.send({ success: true, data: settings });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch location settings',
      });
    }
  }

  async updateLocation(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = updateLocationSchema.parse(request.body);
      
      // Build update data only with defined values
      const updateData: { 
        googleMapsEmbed?: string; 
        address?: string; 
        googleMapsLink?: string;
      } = {};
      
      if (body.googleMapsEmbed !== undefined) {
        updateData.googleMapsEmbed = body.googleMapsEmbed;
      }
      if (body.address !== undefined) {
        updateData.address = body.address;
      }
      if (body.googleMapsLink !== undefined) {
        updateData.googleMapsLink = body.googleMapsLink;
      }
      
      const settings = await this.settingsService.updateLocationSettings(updateData);
      return reply.send({ success: true, data: settings });
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
        error: 'Failed to update location settings',
      });
    }
  }

  async getSiteContent(request: FastifyRequest, reply: FastifyReply) {
    try {
      const content = await this.settingsService.getSiteContent();
      return reply.send({ success: true, data: content });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch site content',
      });
    }
  }

  async updateSiteContent(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as Record<string, any>;
      const content = await this.settingsService.updateSiteContent(body);
      return reply.send({
        success: true,
        data: content,
        message: 'Site content updated successfully',
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to update site content',
      });
    }
  }

  async getAllSettings(request: FastifyRequest, reply: FastifyReply) {
    try {
      const settings = await this.settingsService.getAllSettings();
      return reply.send({ success: true, data: settings });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch settings',
      });
    }
  }
}

