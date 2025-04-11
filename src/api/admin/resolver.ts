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
  public async addEmployeeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.addEmployeeV1(user_data, token_data, domain_code);
  }
  public async uploadEmployeeImageV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.uploadEmployeeImageV1(user_data, token_data, domain_code);
  }
  public async updateEmployeeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.updateEmployeeV1(user_data, token_data, domain_code);
  }
  public async deleteEmployeeImageV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.deleteEmployeeImageV1(user_data, token_data, domain_code);
  }
  public async listEmployeesV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.listEmployeesV1(user_data, token_data, domain_code);
  }
  public async getEmployeeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.getEmployeeV1(user_data, token_data, domain_code);
  }
  public async deleteEmployeeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.deleteEmployeeV1(user_data, token_data, domain_code);
  }
  public async listTransactionTypeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.listTransactionTypeV1(user_data, token_data, domain_code);
  }
  public async listUserTypeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.listUserTypeV1(user_data, token_data, domain_code);
  }
}