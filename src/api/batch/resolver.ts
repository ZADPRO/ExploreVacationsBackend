import { BatchRepository } from "./batch-repository";


export class batchResolver {
  public BatchRepository: any;
  constructor() {
    this.BatchRepository = new BatchRepository();
  }
  public async sendTourRemV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.BatchRepository.sendTourRemV1(user_data, token_data, domain_code);
  }
  public async sendCarRemV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.BatchRepository.sendCarRemV1(user_data, token_data, domain_code);
  }
  public async sendParkingRemV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.BatchRepository.sendParkingRemV1(user_data, token_data, domain_code);
  }

}