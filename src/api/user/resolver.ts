import { userRepository } from "./user-repository";


export class userResolver {
  public userRepository: any;
  constructor() {
    this.userRepository = new userRepository();
  }
  public async tourBookingV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.tourBookingV1(user_data, token_data, domain_code);
  }
  public async customizeBookingV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.customizeBookingV1(user_data, token_data, domain_code);
  }
  public async userCarBookingV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.userCarBookingV1(user_data, token_data, domain_code);
  }
  public async listTourV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.listTourV1(user_data, token_data, domain_code);
  }
  public async uploadCertificateV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.uploadCertificateV1(user_data, token_data, domain_code);
  }
  public async getAllTourV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.getAllTourV1(user_data, token_data, domain_code);
  }
  public async addTravalDataV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.addTravalDataV1(user_data, token_data, domain_code);
  }
  public async uploadMapV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.uploadMapV1(user_data, token_data, domain_code);
  }

}