import { ServiceRepository } from '../../db/repositories/service-repository.js';
import { Service, NewService } from '../../db/schema/service.js';

export class ServiceManagementService {
  constructor(private serviceRepository = new ServiceRepository()) {}

  async createService(data: NewService): Promise<Service> {
    return await this.serviceRepository.create(data);
  }

  async getService(id: string): Promise<Service | undefined> {
    return await this.serviceRepository.findById(id);
  }

  async getAllServices(): Promise<Service[]> {
    return await this.serviceRepository.findAll();
  }

  async getActiveServices(): Promise<Service[]> {
    return await this.serviceRepository.findActive();
  }

  async updateService(id: string, data: Partial<NewService>): Promise<Service> {
    return await this.serviceRepository.update(id, data);
  }

  async deleteService(id: string): Promise<void> {
    await this.serviceRepository.delete(id);
  }
}
