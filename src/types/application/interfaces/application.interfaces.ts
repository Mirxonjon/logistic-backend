export namespace ApplicationInterfaces {
  export interface CreateApplicationDto {
    status: string;
    created_by?: string;
    data: object;
    organization: string;
    application_form: string;
  }

  export interface UpdateApplicationDto {
    status?: string;
    data?: object;
  }

  export interface ApplicationQuery {
    status?: string;
    organization?: string;
    application_form?: string;
    created_by?: string;
    page?: number;
    limit?: number;
    all?: boolean;
  }

  export interface ApplicationResponse {
    board: any;
    response_files: any[];
  }

  export interface ApplicationsResponse {
    total_docs: number;
    total_page: number;
    current_page: number;
    data: any[];
  }
}
