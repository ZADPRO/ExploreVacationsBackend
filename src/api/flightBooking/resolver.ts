import { flightRepository } from "./flight-repository";


export class flightResolver {
  public flightRepository: any;
  constructor() {
    this.flightRepository = new flightRepository();
  }
  public async flightBookingV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.flightRepository.flightBookingV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async userflightBookingHistoryV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.flightRepository.userflightBookingHistoryV1(
      user_data,
      token_data,
      domain_code
    );
  }
  public async listFlightBookingV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.flightRepository.listFlightBookingV1(
      user_data,
      token_data,
      domain_code
    );
  }
 
  public async deleteFlightBookingV1(
    user_data: any,
    token_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.flightRepository.deleteFlightBookingV1(
      user_data,
      token_data,
      domain_code
    );
  }
 
}