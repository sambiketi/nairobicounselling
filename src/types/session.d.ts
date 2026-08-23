import "fastify";

declare module "fastify" {
  interface Session {
    user?: {
      id: string;
      username: string;
      fullName: string;
      role: string;
    };
    sessionId?: string;
    save(): Promise<void>;
    destroy(callback?: (err?: Error) => void): void;
  }
}
