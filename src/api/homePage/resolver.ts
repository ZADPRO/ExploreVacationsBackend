// import { homePageRepository } from "./homePage-repository";


// export class homePageResolver {
//   public homePageRepository: any;
//   constructor() {
//     this.homePageRepository = new homePageRepository();
//   }
//   public async uploadHomeImagesV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
//     return await this.homePageRepository.uploadHomeImagesV1(user_data, token_data, domain_code);
//   }
// }


import { homePageRepository } from "./homePage-repository";

export class homePageResolver {
  public homePageRepository: any;

  constructor() {
    this.homePageRepository = new homePageRepository();
  }

  public async uploadHomeImagesV1(user_data: any, token_data: any, domain_code: any): Promise<any> {
    return await this.homePageRepository.uploadHomeImagesV1(user_data, token_data, domain_code);
  }
}
