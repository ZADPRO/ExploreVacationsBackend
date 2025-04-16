import { carsRepository } from "./cars-repository";

export class carsResolver {
  public carsRepository: any;
  constructor() {
    this.carsRepository = new carsRepository();
  }
  public async addVehicleV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.addVehicleV1(user_data, token_data, domain_code);
  }
  public async updateVehicleV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.updateVehicleV1(user_data, token_data, domain_code);
  }
  public async listVehicleV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.listVehicleV1(user_data, token_data, domain_code);
  }
  public async deleteVehicleV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.deleteVehicleV1(user_data, token_data, domain_code);
  }

  public async addBenifitsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.addBenifitsV1(user_data, token_data, domain_code);
  }
  public async updateBenifitsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.updateBenifitsV1(user_data, token_data, domain_code);
  }
  public async listBenifitsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.listBenifitsV1(user_data, token_data, domain_code);
  }
  public async deleteBenifitsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.deleteBenifitsV1(user_data, token_data, domain_code);
  }

  public async addIncludeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.addIncludeV1(user_data, token_data, domain_code);
  }
  public async updateIncludeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.updateIncludeV1(user_data, token_data, domain_code);
  }
  public async listIncludeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.listIncludeV1(user_data, token_data, domain_code);
  }
  public async deleteIncludeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.deleteIncludeV1(user_data, token_data, domain_code);
  }

  public async addExcludeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.addExcludeV1(user_data, token_data, domain_code);
  }
  public async UpdateExcludeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.UpdateExcludeV1(user_data, token_data, domain_code);
  }
  public async listExcludeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.listExcludeV1(user_data, token_data, domain_code);
  }
  public async deleteExcludeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.deleteExcludeV1(user_data, token_data, domain_code);
  }

  public async addDriverDetailsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.addDriverDetailsV1(user_data, token_data, domain_code);
  }
  public async updateDriverDetailsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.updateDriverDetailsV1(user_data, token_data, domain_code);
  }
  public async listDriverDetailsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.listDriverDetailsV1(user_data, token_data, domain_code);
  }
  public async deleteDriverDetailsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.deleteDriverDetailsV1(user_data, token_data, domain_code);
  }


  public async addTermsAndConditionsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.addTermsAndConditionsV1(user_data, token_data, domain_code);
  }
  public async addFormDetailsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.addFormDetailsV1(user_data, token_data, domain_code);
  }
  public async updateFormDetailsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.updateFormDetailsV1(user_data, token_data, domain_code);
  }
  public async listFormDetailsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.listFormDetailsV1(user_data, token_data, domain_code);
  }
  public async deleteFormDetailsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.deleteFormDetailsV1(user_data, token_data, domain_code);
  }

  public async addCarsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.addCarsV1(user_data, token_data, domain_code);
  }
  public async uploadCarsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.uploadCarsV1(user_data, token_data, domain_code);
  }
  public async deleteCarImageV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.deleteCarImageV1(user_data, token_data, domain_code);
  }
  public async updateCarsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.updateCarsV1(user_data, token_data, domain_code);
  }
  public async listCarsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.listCarsV1(user_data, token_data, domain_code);
  }
  public async getCarsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.getCarsV1(user_data, token_data, domain_code);
  }
  public async deleteCarsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.deleteCarsV1(user_data, token_data, domain_code);
  }
  public async getCarTypeV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.carsRepository.getCarTypeV1(user_data, token_data, domain_code);
  }
 
}