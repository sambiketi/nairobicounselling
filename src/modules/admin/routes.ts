import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { AdminController } from "./controller.js";

export async function adminRoutes(fastify: FastifyInstance) {
  const controller = new AdminController();

  fastify.addHook("preHandler", async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.url === "/admin/login" || request.url === "/api/auth/login") return;

    const user = (request.session as any).user;
    if (!user) {
      if (request.url.startsWith("/api/")) {
        return reply.status(401).send({ success: false, error: "Unauthorized" });
      }
      return reply.redirect("/admin/login");
    }
  });

  fastify.get("/admin/login", async (request, reply) => {
    return reply.view("admin/login.njk", { title: "Admin Login" });
  });

  fastify.get("/api/admin/dashboard", controller.getDashboard.bind(controller));
  fastify.get("/api/admin/stats", controller.getStats.bind(controller));

  fastify.get("/admin", async (request, reply) => {
    return reply.view("admin/dashboard.njk", {
      activePage: "dashboard",
      user: (request.session as any).user || { fullName: "Admin" }
    });
  });

  fastify.get("/admin/location", async (request, reply) => {
    try {
      const { SettingsService } = await import("../settings/service.js");
      const settingsService = new SettingsService();
      const settings = await settingsService.getLocationSettings();
      return reply.view("admin/location-settings.njk", {
        activePage: "location",
        user: (request.session as any).user || { fullName: "Admin" },
        settings: settings
      });
    } catch (error) {
      return reply.view("admin/location-settings.njk", {
        activePage: "location",
        user: (request.session as any).user || { fullName: "Admin" },
        settings: { googleMapsEmbed: null, address: "Nairobi, Kenya", googleMapsLink: null }
      });
    }
  });

  fastify.get("/admin/blog", async (request, reply) => {
    return reply.view("admin/blog/index.njk", {
      activePage: "blog",
      user: (request.session as any).user || { fullName: "Admin" }
    });
  });

  fastify.get("/admin/blog/create", async (request, reply) => {
    return reply.view("admin/blog/create.njk", {
      activePage: "blog",
      user: (request.session as any).user || { fullName: "Admin" }
    });
  });

  fastify.get("/admin/blog/edit/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    try {
      const { BlogService } = await import("../blog/service.js");
      const blogService = new BlogService();
      const post = await blogService.getPost(id);
      return reply.view("admin/blog/edit.njk", {
        activePage: "blog",
        user: (request.session as any).user || { fullName: "Admin" },
        post: post
      });
    } catch (error) {
      return reply.redirect("/admin/blog");
    }
  });

  fastify.get("/admin/counselors", async (request, reply) => {
    try {
      const { TherapistService } = await import("../therapists/service.js");
      const therapistService = new TherapistService();
      const counselors = await therapistService.getAllTherapists();
      return reply.view("admin/counselors.njk", {
        activePage: "counselors",
        user: (request.session as any).user || { fullName: "Admin" },
        counselors: counselors
      });
    } catch (error) {
      return reply.view("admin/counselors.njk", {
        activePage: "counselors",
        user: (request.session as any).user || { fullName: "Admin" },
        counselors: []
      });
    }
  });

  fastify.get("/admin/services", async (request, reply) => {
    try {
      const { ServiceManagementService } = await import("../services/service.js");
      const serviceService = new ServiceManagementService();
      const services = await serviceService.getAllServices();
      return reply.view("admin/services.njk", {
        activePage: "services",
        user: (request.session as any).user || { fullName: "Admin" },
        services: services
      });
    } catch (error) {
      return reply.view("admin/services.njk", {
        activePage: "services",
        user: (request.session as any).user || { fullName: "Admin" },
        services: []
      });
    }
  });

  fastify.get("/admin/gallery", async (request, reply) => {
    try {
      const { GalleryService } = await import("../gallery/service.js");
      const galleryService = new GalleryService();
      const images = await galleryService.getAllImages();
      return reply.view("admin/gallery.njk", {
        activePage: "gallery",
        user: (request.session as any).user || { fullName: "Admin" },
        images: images
      });
    } catch (error) {
      return reply.view("admin/gallery.njk", {
        activePage: "gallery",
        user: (request.session as any).user || { fullName: "Admin" },
        images: []
      });
    }
  });

  fastify.get("/admin/bookings", async (request, reply) => {
    try {
      const { BookingService } = await import("../bookings/service.js");
      const bookingService = new BookingService();
      const bookings = await bookingService.getAllBookings(1, 100);
      return reply.view("admin/bookings.njk", {
        activePage: "bookings",
        user: (request.session as any).user || { fullName: "Admin" },
        bookings: bookings
      });
    } catch (error) {
      return reply.view("admin/bookings.njk", {
        activePage: "bookings",
        user: (request.session as any).user || { fullName: "Admin" },
        bookings: { data: [], total: 0 }
      });
    }
  });

  fastify.get("/admin/bookings/pending", async (request, reply) => {
    try {
      const { BookingService } = await import("../bookings/service.js");
      const bookingService = new BookingService();
      const bookings = await bookingService.getAllBookings(1, 100, { status: "pending" });
      return reply.view("admin/bookings.njk", {
        activePage: "pending",
        user: (request.session as any).user || { fullName: "Admin" },
        bookings: bookings,
        filter: "pending"
      });
    } catch (error) {
      return reply.view("admin/bookings.njk", {
        activePage: "pending",
        user: (request.session as any).user || { fullName: "Admin" },
        bookings: { data: [], total: 0 },
        filter: "pending"
      });
    }
  });

  fastify.get("/admin/settings", async (request, reply) => {
    return reply.view("admin/settings.njk", {
      activePage: "settings",
      user: (request.session as any).user || { fullName: "Admin" }
    });
  });

  fastify.get("/admin/content", async (request, reply) => {
    return reply.view("admin/content.njk", {
      activePage: "content",
      user: (request.session as any).user || { fullName: "Admin" }
    });
  });

  fastify.get("/admin/logout", async (request, reply) => {
    request.session.destroy((err) => {
      if (err) console.error("Logout error:", err);
      return reply.redirect("/");
    });
  });
}
