import { FastifyRequest, FastifyReply } from 'fastify';
import { BlogService } from './service.js';

export class BlogController {
  constructor(private blogService = new BlogService()) {}

  // Public routes
  async getAllPosts(request: FastifyRequest, reply: FastifyReply) {
    try {
      const posts = await this.blogService.getAllPosts();
      return reply.send({ success: true, data: posts });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch blog posts',
      });
    }
  }

  async getPublishedPosts(request: FastifyRequest, reply: FastifyReply) {
    try {
      const posts = await this.blogService.getPublishedPosts();
      return reply.send({ success: true, data: posts });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch published blog posts',
      });
    }
  }

  async getPost(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const post = await this.blogService.getPost(id);
      if (!post) {
        return reply.status(404).send({
          success: false,
          error: 'Blog post not found',
        });
      }
      return reply.send({ success: true, data: post });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch blog post',
      });
    }
  }

  async getPostBySlug(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { slug } = request.params as { slug: string };
      const post = await this.blogService.getPostBySlug(slug);
      if (!post) {
        return reply.status(404).send({
          success: false,
          error: 'Blog post not found',
        });
      }
      return reply.send({ success: true, data: post });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to fetch blog post',
      });
    }
  }

  // Admin routes (write operations)
  async createPost(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = request.body as any;
      const post = await this.blogService.createPost(body);
      return reply.status(201).send({
        success: true,
        data: post,
        message: 'Resource created successfully',
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to create resource',
      });
    }
  }

  async updatePost(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const body = request.body as any;
      const post = await this.blogService.updatePost(id, body);
      return reply.send({
        success: true,
        data: post,
        message: 'Resource updated successfully',
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to update resource',
      });
    }
  }

  async deletePost(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      await this.blogService.deletePost(id);
      return reply.send({
        success: true,
        message: 'Resource deleted successfully',
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to delete resource',
      });
    }
  }

  async publishPost(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const post = await this.blogService.publishPost(id);
      return reply.send({
        success: true,
        data: post,
        message: 'Resource published successfully',
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to publish resource',
      });
    }
  }

  async unpublishPost(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const post = await this.blogService.unpublishPost(id);
      return reply.send({
        success: true,
        data: post,
        message: 'Resource unpublished successfully',
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to unpublish resource',
      });
    }
  }
}
