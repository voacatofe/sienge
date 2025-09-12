export interface CredentialsData {
  subdomain: string;
  username: string;
  password: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface CredentialsFormData {
  subdomain: string;
  username: string;
  password: string;
}
