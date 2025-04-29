import { notificationRepository } from "./notification-repository";


export class notificationResolver {
  public notificationRepository: any;
  constructor() {
    this.notificationRepository = new notificationRepository();
  }
  public async addNotificationsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.notificationRepository.addNotificationsV1(user_data, token_data, domain_code);
  }
  public async updateNotificationsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.notificationRepository.updateNotificationsV1(user_data, token_data, domain_code);
  }
  public async listNotificationsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.notificationRepository.listNotificationsV1(user_data, token_data, domain_code);
  }
  public async getNotificationsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.notificationRepository.getNotificationsV1(user_data, token_data, domain_code);
  }
  public async deleteNotificationsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.notificationRepository.deleteNotificationsV1(user_data, token_data, domain_code);
  }
  public async staffNotificationCountV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.notificationRepository.staffNotificationCountV1(user_data, token_data, domain_code);
  }
  public async staffNotificationsV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.notificationRepository.staffNotificationsV1(user_data, token_data, domain_code);
  }
  public async updateReadStatusV1(user_data: any, token_data: any, domain_code: any,): Promise<any> {
    return await this.notificationRepository.updateReadStatusV1(user_data, token_data, domain_code);
  }
}