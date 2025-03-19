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

}