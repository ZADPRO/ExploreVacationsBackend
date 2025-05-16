import { partnerRepository } from "./partner-repository";

export class partnerResolver {
  public partnerRepository: any;
  constructor() {
    this.partnerRepository = new partnerRepository();
  }
  public async addPartnersV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.partnerRepository.addPartnersV1(user_data, token_data, domain_code);
  }
   public async updatePartnerV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.partnerRepository.updatePartnerV1(user_data, token_data, domain_code);
  }
  public async getPartnersV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.partnerRepository.getPartnersV1(user_data, token_data, domain_code);
  }
  public async deletePartnersV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.partnerRepository.deletePartnersV1(user_data, token_data, domain_code);
  }
  public async listPartnersV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.partnerRepository.listPartnersV1(user_data, token_data, domain_code);
  }
  public async addOffersV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.partnerRepository.addOffersV1(user_data, token_data, domain_code);
  }
  public async updateOffersV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.partnerRepository.updateOffersV1(user_data, token_data, domain_code);
  }
  public async deleteOffersV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.partnerRepository.deleteOffersV1(user_data, token_data, domain_code);
  }
  public async listOffersV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.partnerRepository.listOffersV1(user_data, token_data, domain_code);
  }
  public async applyCouponV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.partnerRepository.applyCouponV1(user_data, token_data, domain_code);
  }
  public async getOffersV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.partnerRepository.getOffersV1(user_data, token_data, domain_code);
  }
  
}