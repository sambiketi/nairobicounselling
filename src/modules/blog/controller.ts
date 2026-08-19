import { FastifyRequest, FastifyReply } from 'fastify';
import { BlogService } from './service.js';

export class BlogController {
  constructor(private blogService = new BlogService()) {}

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
}
