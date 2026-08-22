import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "./service.js";
import { AdminUserRepository } from "../../db/repositories/admin-user-repository.js";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

export class AuthController {
  constructor(private authService = new AuthService(), private adminUserRepo = new AdminUserRepository()) {}

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const body = loginSchema.parse(request.body);
      const user = await this.adminUserRepo.findByUsername(body.username);
      if (!user) {
        return reply.status(401).send({ success: false, error: "Invalid credentials" });
      }
      const isValid = await this.authService.verifyPassword(user.passwordHash, body.password);
      if (!isValid) {
        return reply.status(401).send({ success: false, error: "Invalid credentials" });
      }
      request.session.user = {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      };
      await this.adminUserRepo.updateLastLogin(user.id);
      return reply.send({
        success: true,
        message: "Login successful",
        data: { id: user.id, username: user.username, fullName: user.fullName, role: user.role },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ success: false, error: "Invalid input", details: error.errors });
      }
      return reply.status(500).send({ success: false, error: "Login failed" });
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    request.session.destroy((err) => {
      if (err) {
        return reply.status(500).send({ success: false, error: "Failed to logout" });
      }
      return reply.send({ success: true, message: "Logged out successfully" });
    });
  }

  async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.session.user;
      if (!user) {
        return reply.status(401).send({ success: false, error: "Not authenticated" });
      }
      return reply.send({ success: true, data: user });
    } catch (error) {
      return reply.status(500).send({ success: false, error: "Failed to get user" });
    }
  }
}
