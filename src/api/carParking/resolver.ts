
import { carParkingRepository } from "./carParking-repository";

export class carParkingResolver {
  public carParkingRepository: any;
  constructor() {
    this.carParkingRepository = new carParkingRepository();
  }
  public async addCarParkingV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carParkingRepository.addCarParkingV1(user_data, token_data, domain_code);
  }
  public async uploadParkingImageV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carParkingRepository.uploadParkingImageV1(user_data, token_data, domain_code);
  }
  public async updateCarParkingV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carParkingRepository.updateCarParkingV1(user_data, token_data, domain_code);
  }
  public async listCarParkingV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carParkingRepository.listCarParkingV1(user_data, token_data, domain_code);
  }
  public async getCarParkingV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carParkingRepository.getCarParkingV1(user_data, token_data, domain_code);
  }
  public async deleteCarParkingV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carParkingRepository.deleteCarParkingV1(user_data, token_data, domain_code);
  }
  public async getCarParkingTypeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carParkingRepository.getCarParkingTypeV1(user_data, token_data, domain_code);
  }


  public async addServiceFeaturesV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carParkingRepository.addServiceFeaturesV1(user_data, token_data, domain_code);
  }
  public async updateServiceFeaturesV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carParkingRepository.updateServiceFeaturesV1(user_data, token_data, domain_code);
  }
  public async listServiceFeaturesV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carParkingRepository.listServiceFeaturesV1(user_data, token_data, domain_code);
  }
  public async deleteServiceFeaturesV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carParkingRepository.deleteServiceFeaturesV1(user_data, token_data, domain_code);
  }
  public async deleteParkingImageV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carParkingRepository.deleteParkingImageV1(user_data, token_data, domain_code);
  }
}