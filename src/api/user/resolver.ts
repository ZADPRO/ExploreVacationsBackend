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
  public async uploadPassportV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.uploadPassportV1(user_data, token_data, domain_code);
  }
  public async getAllTourV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.getAllTourV1(user_data, token_data, domain_code);
  }
  public async listCarParkingV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.listCarParkingV1(user_data, token_data, domain_code);
  }
  public async getCarParkingV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.getCarParkingV1(user_data, token_data, domain_code);
  }

  // public async addTravalDataV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
  //   return await this.userRepository.addTravalDataV1(user_data, token_data, domain_code);
  // }
  // public async updateTravalDataV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
  //   return await this.userRepository.updateTravalDataV1(user_data, token_data, domain_code);
  // }
  public async uploadMapV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.uploadMapV1(user_data, token_data, domain_code);
  }
  public async deleteMapV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.deleteMapV1(user_data, token_data, domain_code);
  }
  public async getAllCarV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.getAllCarV1(user_data, token_data, domain_code);
  }
  public async getCarByIdV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.getCarByIdV1(user_data, token_data, domain_code);
  }
  public async listDestinationV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.listDestinationV1(user_data, token_data, domain_code);
  }
  public async userSignUpV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.userSignUpV1(user_data, token_data, domain_code);
  }
  public async forgotPasswordV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.forgotPasswordV1(user_data, token_data, domain_code);
  }
  public async tourBrochureV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.tourBrochureV1(user_data, token_data, domain_code);
  }
  public async profileDataV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.profileDataV1(user_data, token_data, domain_code);
  }
  public async UpdateprofileDataV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.UpdateprofileDataV1(user_data, token_data, domain_code);
  }

  public async tourBookingHistoryV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.tourBookingHistoryV1(user_data, token_data, domain_code);
  }
  public async carBookingHistoryV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.carBookingHistoryV1(user_data, token_data, domain_code);
  }
  public async carParkingHistoryV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.carParkingHistoryV1(user_data, token_data, domain_code);
  }
  public async listAssociateAirportV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.listAssociateAirportV1(user_data, token_data, domain_code);
  }
  public async listParkingTypeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.listParkingTypeV1(user_data, token_data, domain_code);
  }
  public async addUserAddressV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.addUserAddressV1(user_data, token_data, domain_code);
  }
  public async carParkingBookingV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.userRepository.carParkingBookingV1(user_data, token_data, domain_code);
  }
 
}