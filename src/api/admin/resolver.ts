// import { packageRepository } from "./package-repository";

import { adminRepository } from "./admin-repository";


export class adminResolver {
  public adminRepository: any;
  constructor() {
    this.adminRepository = new adminRepository();
  }
  public async adminLoginV1(user_data: any, domain_code: any): Promise<any> {
    return await this.adminRepository.adminLoginV1(user_data, domain_code);
  }
  public async listTourBookingsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.listTourBookingsV1(user_data, token_data, domain_code);
  }
  public async listCarBookingsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.listCarBookingsV1(user_data, token_data, domain_code);
  }
  public async listCustomizeTourBookingsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.listCustomizeTourBookingsV1(user_data, token_data, domain_code);
  }
  public async listAuditPageV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.listAuditPageV1(user_data, token_data, domain_code);
  }
}