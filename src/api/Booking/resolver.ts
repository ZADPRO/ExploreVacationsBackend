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
  public async uploadCarAgreementV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.bookingRepository.uploadCarAgreementV1(user_data, token_data, domain_code);
  }
  public async uploadParkingAgreementV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.bookingRepository.uploadParkingAgreementV1(user_data, token_data, domain_code);
  }
  public async deleteTourAgreementV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.bookingRepository.deleteTourAgreementV1(user_data, token_data, domain_code);
  }
  public async deleteCarAgreementV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.bookingRepository.deleteCarAgreementV1(user_data, token_data, domain_code);
  }
  public async deleteParkingAgreementV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.bookingRepository.deleteParkingAgreementV1(user_data, token_data, domain_code);
  }
}