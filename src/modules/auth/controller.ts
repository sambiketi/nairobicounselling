import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "./service.js";
import { AdminUserRepository } from "../../db/repositories/admin-user-repository.js";
import { z } from "zod";

// ✅ Only username and password validation
const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

export class AuthController {
  constructor(private authService = new AuthService(), private adminUserRepo = new AdminUserRepository()) {}

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      // ✅ Step 1: Validate username and password
      const { username, password } = loginSchema.parse(request.body);
      
      // ✅ Step 2: Find user in database
      const user = await this.adminUserRepo.findByUsername(username);
      if (!user) {
        return reply.status(401).send({ success: false, error: "Invalid credentials" });
      }
      
      // ✅ Step 3: Verify password
      const isValid = await this.authService.verifyPassword(user.passwordHash, password);
      if (!isValid) {
        return reply.status(401).send({ success: false, error: "Invalid credentials" });
      }
      
      // ✅ Step 4: Store user in session
      (request.session as any).user = {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      };
      
      // ✅ Step 5: Return only what's needed
      return reply.send({
        success: true,
        message: "Login successful",
        username: user.username,  // ← Only username
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ success: false, error: "Invalid input" });
      }
      return reply.status(500).send({ success: false, error: "Login failed" });
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      await new Promise<void>((resolve, reject) => {
        request.session.destroy((err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      return reply.send({ success: true, message: "Logged out successfully" });
    } catch (error) {
      return reply.status(500).send({ success: false, error: "Failed to logout" });
    }
  }

  async getCurrentUser(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (request.session as any).user;
      if (!user) {
        return reply.status(401).send({ success: false, error: "Not authenticated" });
      }
      return reply.send({ 
        success: true, 
        data: { 
          username: user.username,
          fullName: user.fullName,
          role: user.role 
        } 
      });
    } catch (error) {
      return reply.status(500).send({ success: false, error: "Failed to get user" });
    }
  }
}
