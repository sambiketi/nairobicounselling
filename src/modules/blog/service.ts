import { BlogRepository } from '../../db/repositories/blog-repository.js';
import { BlogPost, NewBlogPost } from '../../db/schema/blog.js';

export class BlogService {
  constructor(private blogRepository = new BlogRepository()) {}

  async createPost(data: NewBlogPost): Promise<BlogPost> {
    return await this.blogRepository.create(data);
  }

  async getPost(id: string): Promise<BlogPost | undefined> {
    return await this.blogRepository.findById(id);
  }

  async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return await this.blogRepository.findBySlug(slug);
  }

  async getAllPosts(): Promise<BlogPost[]> {
    return await this.blogRepository.findAll();
  }

  async getPublishedPosts(): Promise<BlogPost[]> {
    return await this.blogRepository.findPublished();
  }

  async updatePost(id: string, data: Partial<NewBlogPost>): Promise<BlogPost> {
    return await this.blogRepository.update(id, data);
  }

  async deletePost(id: string): Promise<void> {
    await this.blogRepository.delete(id);
  }

  async publishPost(id: string): Promise<BlogPost> {
    return await this.blogRepository.update(id, {
      isPublished: true,
      publishedAt: new Date(),
    });
  }

  async unpublishPost(id: string): Promise<BlogPost> {
    return await this.blogRepository.update(id, {
      isPublished: false,
      publishedAt: null,
    });
  }
}
