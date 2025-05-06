import { paymentRepository } from "./paymentRepository";
export class paymentResolver {
  public paymentRepository: any;
  constructor() {
    this.paymentRepository = new paymentRepository();
  }
  public async calculationV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.paymentRepository.calculationV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async paymentV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.paymentRepository.paymentV1(
      user_data,
      token_data,
      domain_code
    );
  }
}
