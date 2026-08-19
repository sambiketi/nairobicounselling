import { TherapistRepository } from '../../db/repositories/therapist-repository.js';
import { Therapist, NewTherapist } from '../../db/schema/therapist.js';

export class TherapistService {
  constructor(private therapistRepository = new TherapistRepository()) {}

  async createTherapist(data: NewTherapist): Promise<Therapist> {
    return await this.therapistRepository.create(data);
  }

  async getTherapist(id: string): Promise<Therapist | undefined> {
    return await this.therapistRepository.findById(id);
  }

  async getAllTherapists(): Promise<Therapist[]> {
    return await this.therapistRepository.findAll();
  }

  async getActiveTherapists(): Promise<Therapist[]> {
    return await this.therapistRepository.findActive();
  }

  async updateTherapist(id: string, data: Partial<NewTherapist>): Promise<Therapist> {
    return await this.therapistRepository.update(id, data);
  }

  async deleteTherapist(id: string): Promise<void> {
    await this.therapistRepository.delete(id);
  }
}
