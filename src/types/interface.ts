export interface ILoginRequest {
  userName: string;
  password: string;
}

export interface IRegisterRequest {
  userName: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Basic response structure (adjust if your API returns something else like data/token)
export interface IAuthResponse {
  statusCode: number;
  message: string;
  data: string; // Typically the token is here
}
