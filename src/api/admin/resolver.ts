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
}