
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
  public async deletePackageV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.packageRepository.deletePackageV1(user_data, token_data, domain_code);
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

  public async addTravalIncludeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.packageRepository.addTravalIncludeV1(user_data, token_data, domain_code);
  }
  public async updateTravalIncludeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.packageRepository.updateTravalIncludeV1(user_data, token_data, domain_code);
  }
  public async deleteTravalIncludeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.packageRepository.deleteTravalIncludeV1(user_data, token_data, domain_code);
  }
  public async listTravalIncludeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.packageRepository.listTravalIncludeV1(user_data, token_data, domain_code);
  }

  public async addTravalExcludeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.packageRepository.addTravalExcludeV1(user_data, token_data, domain_code);
  } 
  public async updateTravalExcludeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.packageRepository.updateTravalExcludeV1(user_data, token_data, domain_code);
  } 
  public async deleteTravalExcludeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.packageRepository.deleteTravalExcludeV1(user_data, token_data, domain_code);
  } 
  public async listTravalExcludeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.packageRepository.listTravalExcludeV1(user_data, token_data, domain_code);
  } 
  public async uploadCoverImageV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.packageRepository.uploadCoverImageV1(user_data, token_data, domain_code);
  } 
  
}