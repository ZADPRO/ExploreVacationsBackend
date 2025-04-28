
import { patmentRepository } from "./payment-repository";

export class paymentResolver {
  public patmentRepository: any;
  constructor() {
    this.patmentRepository = new patmentRepository();
  }
  public async calculationV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.patmentRepository.calculationV1(user_data, token_data, domain_code);
  }
  public async paymentV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.patmentRepository.paymentV1(user_data, token_data, domain_code);
  }
}