export interface AuthResponseData {
  user: {
    id: string;
    name: string;
    email: string;
    phoneNumber: string;
    roleId: string;
  };
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponseData {
  accessToken: string;
}
