export namespace TelegramGroupInterfaces {
  export interface TelegramGroup {
    id: number;
    username: string;
    title?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface TelegramGroupQuery {
    isActive?: boolean;
    page?: number;
    limit?: number;
  }
}
