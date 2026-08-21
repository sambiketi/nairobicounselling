import { FastifyInstance } from 'fastify';
import { SettingsService } from '../modules/settings/service.js';
import { BlogRepository } from '../db/repositories/blog-repository.js';
import { TherapistService } from '../modules/therapists/service.js';

export async function homeRoutes(fastify: FastifyInstance) {
  const settingsService = new SettingsService();

  // Home page with location and blog posts
  fastify.get('/', async (request, reply) => {
    try {
      let location = {
        address: 'Nairobi, Kenya',
        googleMapsEmbed: null,
        googleMapsLink: null
      };
      
      try {
        location = await settingsService.getLocationSettings();
      } catch (err) {
        console.error('Error loading location:', err);
      }

      let blogPosts = [];
      try {
        const blogRepository = new BlogRepository();
        blogPosts = await blogRepository.findPublished() || [];
      } catch (err) {
        console.error('Error loading blog posts:', err);
        blogPosts = [];
      }

      return reply.view('index.njk', {
        title: 'Nairobi Counseling Center - Professional Counseling Services',
        location: location,
        blogPosts: blogPosts
      });
    } catch (error) {
      console.error('Error loading home page:', error);
      return reply.view('index.njk', {
        title: 'Nairobi Counseling Center - Professional Counseling Services',
        location: {
          address: 'Nairobi, Kenya',
          googleMapsEmbed: null,
          googleMapsLink: null
        },
        blogPosts: []
      });
    }
  });

  // Counselors page
  fastify.get('/counselors', async (request, reply) => {
    try {
      const therapistService = new TherapistService();
      const counselors = await therapistService.getActiveTherapists();
      return reply.view('counselors.njk', {
        title: 'Our Counselors - Nairobi Counseling Center',
        counselors: counselors,
      });
    } catch (error) {
      console.error('Error loading counselors:', error);
      return reply.view('counselors.njk', {
        title: 'Our Counselors - Nairobi Counseling Center',
        counselors: []
      });
    }
  });

  // Support old /therapists route for backward compatibility
  fastify.get('/therapists', async (request, reply) => {
    try {
      const therapistService = new TherapistService();
      const counselors = await therapistService.getActiveTherapists();
      return reply.view('counselors.njk', {
        title: 'Our Counselors - Nairobi Counseling Center',
        counselors: counselors,
      });
    } catch (error) {
      return reply.view('counselors.njk', {
        title: 'Our Counselors - Nairobi Counseling Center',
        counselors: []
      });
    }
  });

  // About page
  fastify.get('/about', async (request, reply) => {
    try {
      return reply.view('about.njk', {
        title: 'About Us - Nairobi Counseling Center'
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to load about page'
      });
    }
  });

  // Blog page (Resources)
  fastify.get('/blog', async (request, reply) => {
    try {
      let posts = [];
      try {
        const blogRepository = new BlogRepository();
        posts = await blogRepository.findPublished() || [];
      } catch (err) {
        console.error('Error loading blog posts from database:', err);
        posts = [];
      }
      
      return reply.view('blog.njk', {
        title: 'Resources - Nairobi Counseling Center',
        posts: posts
      });
    } catch (error) {
      console.error('Error loading blog page:', error);
      return reply.view('blog.njk', {
        title: 'Resources - Nairobi Counseling Center',
        posts: []
      });
    }
  });

  // Support /resources route
  fastify.get('/resources', async (request, reply) => {
    try {
      let posts = [];
      try {
        const blogRepository = new BlogRepository();
        posts = await blogRepository.findPublished() || [];
      } catch (err) {
        console.error('Error loading blog posts from database:', err);
        posts = [];
      }
      return reply.view('blog.njk', {
        title: 'Resources - Nairobi Counseling Center',
        posts: posts
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        error: 'Failed to load resources page'
      });
    }
  });

  // Blog post page
  fastify.get('/blog/:slug', async (request, reply) => {
    try {
      const { slug } = request.params as { slug: string };
      let post = null;
      
      try {
        const blogRepository = new BlogRepository();
        post = await blogRepository.findBySlug(slug);
      } catch (err) {
        console.error('Error loading blog post:', err);
        post = null;
      }
      
      if (!post) {
        return reply.status(404).send('Resource not found');
      }
      
      return reply.view('blog-post.njk', {
        title: post.title + ' - Nairobi Counseling Center',
        post: post
      });
    } catch (error) {
      console.error('Error loading blog post:', error);
      return reply.status(500).send({
        success: false,
        error: 'Failed to load resource'
      });
    }
  });

  // Contact page with location
  fastify.get('/contact', async (request, reply) => {
    try {
      let location = {
        address: 'Nairobi, Kenya',
        googleMapsEmbed: null,
        googleMapsLink: null
      };
      
      try {
        location = await settingsService.getLocationSettings();
      } catch (err) {
        console.error('Error loading location:', err);
      }
      
      return reply.view('contact.njk', {
        title: 'Contact Us - Nairobi Counseling Center',
        location: location
      });
    } catch (error) {
      console.error('Error loading contact page:', error);
      return reply.view('contact.njk', {
        title: 'Contact Us - Nairobi Counseling Center',
        location: {
          address: 'Nairobi, Kenya',
          googleMapsEmbed: null,
          googleMapsLink: null
        }
      });
    }
  });
}
