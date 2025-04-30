import { bookingRepository } from "./bookingRepository";


export class bookingResolver {
  public bookingRepository: any;
  constructor() {
    this.bookingRepository = new bookingRepository();
  }
  public async approveTourBookingV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.bookingRepository.approveTourBookingV1(user_data, token_data, domain_code);
  }
  public async approveCarBookingV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.bookingRepository.approveCarBookingV1(user_data, token_data, domain_code);
  }
  public async approveCustomizeTourBookingV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.bookingRepository.approveCustomizeTourBookingV1(user_data, token_data, domain_code);
  }
  public async approveParkingBookingV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.bookingRepository.approveParkingBookingV1(user_data, token_data, domain_code);
  }
  public async uploadTourAgreementV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.bookingRepository.uploadTourAgreementV1(user_data, token_data, domain_code);
  }
}