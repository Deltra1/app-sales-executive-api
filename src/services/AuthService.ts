import { Service, Inject } from 'typedi';
import jsonwebtoken from 'jsonwebtoken';
import mongoose from 'mongoose';

import { IUserModel } from '../models/User';
import SystemError from './errors/SystemError';
import ServiceError from './errors/ServiceError';
import AuthenticationError from './errors/auth/AuthenticationError';
import AuthorizationError from './errors/auth/AuthorizationError';
import IUser from '../models/interfaces/IUser';
import { AuthDataOutputDTO } from './interfaces/IAuthServiceDTO';

@Service()
export default class AuthService {
  public constructor(@Inject('userModel') private userModel: IUserModel, @Inject('config') private config: App.Config) {}

  private generateAccessToken(user: IUser) {
    return jsonwebtoken.sign({ id: user._id }, this.config.jwt.accessToken.secret, {
      expiresIn: this.config.jwt.accessToken.expireIn,
    });
  }

  private generateRefreshToken(user: IUser) {
    return jsonwebtoken.sign({ id: user._id }, this.config.jwt.refreshToken.secret, {
      expiresIn: this.config.jwt.refreshToken.expireIn,
    });
  }

  /**
   * generateToken
   * @param { User } User
   */
  private generateTokens(user: IUser) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return { accessToken, refreshToken };
  }

  /**
   * _verifyAndDecodetoken
   * @param {string} token
   * @return {object} decoded token object
   * @throws AuthorizationError;
   */
  private verifyAndDecodeToken(token: string, secret: string): object | string {
    try {
      return jsonwebtoken.verify(token, secret);
    } catch (error) {
      throw new AuthorizationError({ error });
    }
  }

  /**
   * Checklogin
   * @param {String} userId
   * @param {String} password
   * @return {Object} User object
   * @throws {AuthenticationError|SystemError}
   */
  public async checkSalesExecutiveLogin(userId: string, password: string): Promise<IUser> {
    let loggedInUser: IUser | null = null;
    try {
      loggedInUser = await this.userModel.findUserByUserIdAndPassword(userId, password);
    } catch (error) {
      throw new SystemError({ error });
    }
    if (!loggedInUser) {
      throw new AuthenticationError();
    }
    if (loggedInUser.role?.toString() !== this.config.company.salesExecutiveRoleName) {
      throw new AuthenticationError();
    }
    // check
    if (loggedInUser.client.isActive === false || loggedInUser.isActive === false) {
      throw new AuthenticationError();
    }

    return loggedInUser;
  }

  /**
   * Login
   * @param {String} userId
   * @param {String} password
   * @return {Object} user, token
   * @throws {SystemError}
   */
  public async login(userId: string, password: string, version: string): Promise<AuthDataOutputDTO> {
    //check App version are old
    if (version === '0.0.0') {
      throw new ServiceError({
        httpCode: 401,
        message: 'Deprecated apk',
        description: 'Invalid Request',
      });
    }
    const user: IUser = await this.checkSalesExecutiveLogin(userId, password);
    const token = this.generateTokens(user);
    user.tokens.push(token);
    try {
      await user.save();
    } catch (error) {
      /* istanbul ignore next */
      throw new SystemError({ error });
    }
    //attach app version to tokens
    return { user, token };
  }

  /**
   * logout
   * @param {User} user UserModel
   * @param {String} token string
   * @return boolean true on success
   * @throws {SystemError}
   */
  public async logout(id: string, token: string): Promise<boolean> {
    let user;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      user = await this.userModel.findById(id).session(session);
      if (!user) {
        throw new ServiceError({
          httpCode: 404,
          message: 'User not found',
          description: 'Invalid Request',
        });
      }
    } catch (error) {
      /* istanbul ignore next */
      await (async () => {
        await session.abortTransaction();
        session.endSession();
        throw new SystemError({ error });
      })();
    }
    if (!user) {
      throw new AuthorizationError();
    }
    const currentTokenIndex = user.tokens.findIndex((t) => t.accessToken === token);
    if (currentTokenIndex < 0) {
      throw new ServiceError({
        httpCode: 401,
        message: 'Access denied',
        description: 'Invalid Request',
      });
    }
    user.tokens.splice(currentTokenIndex, 1);
    try {
      await user.save({ session });
      await session.commitTransaction();
    } catch (error) {
      /* istanbul ignore next */
      await (async () => {
        await session.abortTransaction();
        session.endSession();
        throw new SystemError({ error });
      })();
    }
    return true;
  }

  /**
   * logoutAll
   * @param {User} user UserModel
   * @return boolean true
   * @throws {SystemError}
   */
  public async logoutAll(id: string): Promise<boolean> {
    try {
      const user: IUser | null = await this.userModel.findById(id);
      if (!user) {
        return false;
      }
      user.tokens = [];
      await user.save();
    } catch (error) {
      /* istanbul ignore next */
      throw new SystemError({ error });
    }
    return true;
  }

  /**
   * authenticateUser
   * @param {string} userId
   * @param {string} password
   * @param {object} token
   * @return {object} UserModel object if success or boolean false on failure
   * @throws {AuthenticationError|SystemError}
   */
  public async authenticateUser(token: string): Promise<IUser> {
    // decode token
    const decodedToken: any = this.verifyAndDecodeToken(token, this.config.jwt.accessToken.secret);

    if (!decodedToken) {
      throw new AuthorizationError();
    }
    // find user inside database
    const userId = decodedToken.id;
    let user: IUser | null;

    try {
      user = await this.userModel.findById(userId);
    } catch (error) {
      /* istanbul ignore next */
      throw new SystemError({ error });
    }
    if (!user) {
      throw new AuthorizationError();
    }

    // check given token exists
    const tokenExists = user.tokens.some((t) => t.accessToken === token);
    if (tokenExists) {
      return user;
    }
    throw new AuthorizationError();
  }

  /**
   * regenerateAccessToken
   * @param {string} refreshToken
   * @throw {SystemError|AuthorizationError}
   */
  public async regenerateAccessToken(refreshToken: string): Promise<string> {
    // check refreshToken is valid
    const decodedToken: any = this.verifyAndDecodeToken(refreshToken, this.config.jwt.refreshToken.secret);
    if (!decodedToken) {
      throw new AuthorizationError();
    }
    // fetch user from the database
    let user: IUser | null;
    try {
      user = await this.userModel.findById(decodedToken.id);
    } catch (e) {
      /* istanbul ignore next */
      throw new SystemError();
    }

    if (!user) {
      throw new AuthorizationError();
    }
    // generate new access token
    const newAccessToken = this.generateAccessToken(user);
    // update user
    const currentTokenIndex = user.tokens.findIndex((token) => token.refreshToken === refreshToken);
    if (currentTokenIndex < 0) {
      throw new AuthorizationError();
    }
    user.tokens[currentTokenIndex].accessToken = newAccessToken;
    try {
      await user.save();
    } catch (e) {
      /* istanbul ignore next */
      throw new SystemError();
    }
    return newAccessToken;
  }
}
