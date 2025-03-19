
import { settingsRepository } from "./settings-repository";

export class settingsResolver {
  public settingsRepository: any;
  constructor() {
    this.settingsRepository = new settingsRepository();
  }
  public async addDestinationV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingsRepository.addDestinationV1(user_data, token_data, domain_code);
  }
  public async UpdateDestinationV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingsRepository.UpdateDestinationV1(user_data, token_data, domain_code);
  }
  public async listDestinationV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingsRepository.listDestinationV1(user_data, token_data, domain_code);
  }
  public async DeleteDestinationV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingsRepository.DeleteDestinationV1(user_data, token_data, domain_code);
  }

  public async addLocationV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingsRepository.addLocationV1(user_data, token_data, domain_code);
  }
  public async updateLocationV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingsRepository.updateLocationV1(user_data, token_data, domain_code);
  }
  public async listLocationV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingsRepository.listLocationV1(user_data, token_data, domain_code);
  }

  public async addCategoriesV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingsRepository.addCategoriesV1(user_data, token_data, domain_code);
  }
  public async updateCategoriesV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingsRepository.updateCategoriesV1(user_data, token_data, domain_code);
  }
  public async listCategoriesV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingsRepository.listCategoriesV1(user_data, token_data, domain_code);
  }

  public async addActivitiesV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingsRepository.addActivitiesV1(user_data, token_data, domain_code);
  }
  public async updateActivitiesV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingsRepository.updateActivitiesV1(user_data, token_data, domain_code);
  }
  public async listActivitiesV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.settingsRepository.listActivitiesV1(user_data, token_data, domain_code);
  }
}