import IUser from '../../models/interfaces/IUser';

export interface AuthDataOutputDTO {
  user: IUser;
  token: {
    accessToken: string;
    refreshToken: string;
  };
}
