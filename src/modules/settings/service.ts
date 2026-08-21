import { SettingsRepository } from '../../db/repositories/settings-repository.js';

export class SettingsService {
  constructor(private settingsRepository = new SettingsRepository()) {}

  async getSetting(key: string): Promise<any> {
    const setting = await this.settingsRepository.findByKey(key);
    return setting?.value;
  }

  async setSetting(key: string, value: any): Promise<any> {
    const existing = await this.settingsRepository.findByKey(key);
    if (existing) {
      return await this.settingsRepository.update(key, value);
    } else {
      return await this.settingsRepository.create({ key, value });
    }
  }

  async getLocationSettings() {
    const [googleMapsEmbed, address, googleMapsLink] = await Promise.all([
      this.getSetting('google_maps_embed'),
      this.getSetting('address'),
      this.getSetting('google_maps_link'),
    ]);
    return { 
      googleMapsEmbed: googleMapsEmbed || null, 
      address: address || 'Nairobi, Kenya', 
      googleMapsLink: googleMapsLink || null 
    };
  }

  async updateLocationSettings(data: { 
    googleMapsEmbed?: string; 
    address?: string; 
    googleMapsLink?: string;
  }) {
    const updates = [];
    if (data.googleMapsEmbed !== undefined) {
      updates.push(this.setSetting('google_maps_embed', data.googleMapsEmbed));
    }
    if (data.address !== undefined) {
      updates.push(this.setSetting('address', data.address));
    }
    if (data.googleMapsLink !== undefined) {
      updates.push(this.setSetting('google_maps_link', data.googleMapsLink));
    }
    await Promise.all(updates);
    return await this.getLocationSettings();
  }

  async getSiteContent(): Promise<Record<string, any>> {
    const keys = [
      'business_name', 'tagline', 'hero_title', 'hero_subtitle',
      'phone', 'email', 'support_email', 'crisis_hotline',
      'hours_weekday', 'hours_saturday', 'hours_sunday',
      'whatsapp_number', 'footer_text', 'copyright_text'
    ];
    
    const settings = await Promise.all(
      keys.map(key => this.getSetting(key))
    );
    
    const content: Record<string, any> = {};
    keys.forEach((key, index) => {
      content[key] = settings[index] || null;
    });
    
    return content;
  }

  async updateSiteContent(data: Record<string, any>): Promise<Record<string, any>> {
    const updates = Object.entries(data).map(([key, value]) => 
      this.setSetting(key, value)
    );
    await Promise.all(updates);
    return await this.getSiteContent();
  }

  async getAllSettings(): Promise<Record<string, any>> {
    const settings = await this.settingsRepository.findAll();
    const result: Record<string, any> = {};
    for (const setting of settings) {
      result[setting.key] = setting.value;
    }
    return result;
  }
}

