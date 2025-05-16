import { newCarsRepository } from "./newCar-repository";

export class newCarsResolver {
  public newCarsRepository: any;
  constructor() {
    this.newCarsRepository = new newCarsRepository();
  }
  public async addCarGroupV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.newCarsRepository.addCarGroupV1(user_data, token_data, domain_code);
  }
}