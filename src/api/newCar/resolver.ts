import { newCarsRepository } from "./newCar-repository";

export class newCarsResolver {
  public newCarsRepository: any;
  constructor() {
    this.newCarsRepository = new newCarsRepository();
  }
  public async addCarGroupV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.newCarsRepository.addCarGroupV1(user_data, token_data, domain_code);
  }
  public async updateCarGroupV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.newCarsRepository.updateCarGroupV1(user_data, token_data, domain_code);
  }
  public async deleteCarGroupV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.newCarsRepository.deleteCarGroupV1(user_data, token_data, domain_code);
  }
  public async listCarGroupV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.newCarsRepository.listCarGroupV1(user_data, token_data, domain_code);
  }
  public async userOfflineCarBookingV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.newCarsRepository.userOfflineCarBookingV1(user_data, token_data, domain_code);
  }
  public async listOfflineCarBookingV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.newCarsRepository.listOfflineCarBookingV1(user_data, token_data, domain_code);
  }
  public async deleteOfflineCarBookingV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.newCarsRepository.deleteOfflineCarBookingV1(user_data, token_data, domain_code);
  }
  public async uploadPassportV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.newCarsRepository.uploadPassportV1(user_data, token_data, domain_code);
  }
  public async uploadLicenseV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.newCarsRepository.uploadLicenseV1(user_data, token_data, domain_code);
  }
  public async deletePassportV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.newCarsRepository.deletePassportV1(user_data, token_data, domain_code);
  }
  public async deleteLicenseV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.newCarsRepository.deleteLicenseV1(user_data, token_data, domain_code);
  }
}