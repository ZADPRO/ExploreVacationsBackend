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

  // ---------------------------------------------------------------------------------------------------------------


  public async homeImageContentV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.bookingRepository.homeImageContentV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async updateContentV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.bookingRepository.updateContentV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async deletehomeImageContentV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.bookingRepository.deletehomeImageContentV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async uploadImagesV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.bookingRepository.uploadImagesV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async deletehomeImageV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.bookingRepository.deletehomeImageV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async listhomeImageV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.bookingRepository.listhomeImageV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async getHomeImageV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.bookingRepository.getHomeImageV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async listhomeImageUserSideV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.bookingRepository.listhomeImageUserSideV1(
      user_data,
      token_data,
      domain_code
    );
  }
}

