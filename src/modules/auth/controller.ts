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
      console.log("========================================");
      console.log("🔐 LOGIN ATTEMPT");
      console.log("========================================");
      
      const body = loginSchema.parse(request.body);
      console.log("📝 Username:", body.username);
      
      const user = await this.adminUserRepo.findByUsername(body.username);
      if (!user) {
        console.log("❌ User NOT found:", body.username);
        return reply.status(401).send({ success: false, error: "Invalid credentials" });
      }
      console.log("✅ User found:", user.username);
      
      const isValid = await this.authService.verifyPassword(user.passwordHash, body.password);
      if (!isValid) {
        console.log("❌ Password INVALID for:", body.username);
        return reply.status(401).send({ success: false, error: "Invalid credentials" });
      }
      console.log("✅ Password VALID");

      // ✅ CORRECT: Fastify Session API
      const userData = {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      };
      
      request.session.set("user", userData);
      console.log("✅ Session SET with data:", userData);
      console.log("🆔 Session ID:", request.session.sessionId);
      
      // Verify session was set
      const verifySession = request.session.get("user");
      console.log("🔍 Session verification after set:", verifySession);
      
      await this.adminUserRepo.updateLastLogin(user.id);
      
      console.log("✅ Login SUCCESS for:", body.username);
      console.log("========================================");
      
      return reply.send({
        success: true,
        message: "Login successful",
        username: user.username,
      });
    } catch (error) {
      console.error("❌ Login ERROR:", error);
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ success: false, error: "Invalid input", details: error.errors });
      }
      return reply.status(500).send({ success: false, error: "Login failed" });
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      console.log("🔓 Logout attempt");
      await new Promise<void>((resolve, reject) => {
        request.session.destroy((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      console.log("✅ Logout successful");
      return reply.send({ success: true, message: "Logged out successfully" });
    } catch (error) {
      return reply.status(500).send({ success: false, error: "Failed to logout" });
    }
  }

  async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = request.session.get("user");
      console.log("🔍 Current user request, session user:", user);
      if (!user) {
        return reply.status(401).send({ success: false, error: "Not authenticated" });
      }
      return reply.send({ success: true, data: user });
    } catch (error) {
      return reply.status(500).send({ success: false, error: "Failed to get user" });
    }
  }
}
