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
  public async listParkingBookingsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.listParkingBookingsV1(user_data, token_data, domain_code);
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
  public async updateEmployeeProfileV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.updateEmployeeProfileV1(user_data, token_data, domain_code);
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
  public async dashBoardV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.dashBoardV1(user_data, token_data, domain_code);
  }
  public async deleteCarBookingsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.deleteCarBookingsV1(user_data, token_data, domain_code);
  }
  public async deleteTourBookingsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.deleteTourBookingsV1(user_data, token_data, domain_code);
  }
  public async deleteCustomizeTourBookingsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.deleteCustomizeTourBookingsV1(user_data, token_data, domain_code);
  }
  public async deleteCarParkingBookingsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.deleteCarParkingBookingsV1(user_data, token_data, domain_code);
  }
  public async listUserDataV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.listUserDataV1(user_data, token_data, domain_code);
  }
  public async getUserDataV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.getUserDataV1(user_data, token_data, domain_code);
  }
  public async viewCarAgreementV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.viewCarAgreementV1(user_data, token_data, domain_code);
  }
  public async deleteAuditV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.deleteAuditV1(user_data, token_data, domain_code);
  }
  public async deleteUsersV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.deleteUsersV1(user_data, token_data, domain_code);
  }
  public async employeeProfileV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.adminRepository.employeeProfileV1(user_data, token_data, domain_code);
  }
}