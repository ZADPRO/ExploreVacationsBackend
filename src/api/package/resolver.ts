
import { packageRepository } from "./package-repository";

export class PackageResolver {
  public packageRepository: any;
  constructor() {
    this.packageRepository = new packageRepository();
  }
  public async addPackageV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.packageRepository.addPackageV1(user_data, token_data, domain_code);
  }
  public async UpdatePackageV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.packageRepository.UpdatePackageV1(user_data, token_data, domain_code);
  }
  public async galleryUploadV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.packageRepository.galleryUploadV1(user_data, token_data, domain_code);
  }
  public async listPackageV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.packageRepository.listPackageV1(user_data, token_data, domain_code);
  }
  public async deleteImageV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.packageRepository.deleteImageV1(user_data, token_data, domain_code);
  }
  
}