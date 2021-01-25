import { JsonController, Post, Get, CurrentUser, BodyParam, HeaderParam, OnUndefined, UseBefore, Req } from 'routing-controllers';

import AuthService from '../services/AuthService';
import { AuthResponseData, RefreshTokenResponseData } from './interfaces/responses/IAuthResponse';
import { AuthDataOutputDTO } from '../services/interfaces/IAuthServiceDTO';
import IUser from '../models/interfaces/IUser';
import { RequireAuth } from '../middlewares/AuthMiddleware';

@JsonController('/auth')
export default class AuthController {
  public constructor(private authService: AuthService) {}

  /**
   * @swagger
   *
   * /auth/login:
   *   post:
   *     tags:
   *      - "auth"
   *     description: Login to the application
   *     consumes:
   *       - application/json
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: body
   *         schema:
   *          $ref: '#/components/schemas/authData'
   *     responses:
   *       200:
   *         description: login
   *         content:
   *          application/json
   *         schema:
   *          $ref: '#/components/schemas/authResponse'
   * @param {string} userId
   * @param {string} password
   * @return {Promise<AuthDataResponse>} Auth response data
   */
  @Post('/login')
  public async login(
    @BodyParam('userId') userId: string,
    @BodyParam('password') password: string,
    @BodyParam('version') version: string,
  ): Promise<AuthResponseData> {
    const authData: AuthDataOutputDTO = await this.authService.login(userId, password, version);
    return {
      ...authData,
      user: authData.user.toJSON(),
    };
  }

  /**
   * @swagger
   *
   * /auth/logout:
   *  get:
   *    tags:
   *      - "auth"
   *    parameters: []
   *    description: Logout user
   *    response:
   *      204
   * @param {IUser} user
   * @param {string} accessToken
   * @return {Promise<void>}
   */
  @Get('/logout')
  @UseBefore(RequireAuth)
  @OnUndefined(204)
  public async logout(@CurrentUser() user: IUser, @HeaderParam('Authorization') accessToken: string): Promise<void> {
    const id = user._id;
    const newAccessToken = accessToken.replace('Bearer ', '');
    await this.authService.logout(id, newAccessToken);
    return;
  }

  /**
   * @swagger
   * /auth/refresh-token:
   *  post:
   *    tags:
   *      - "auth"
   *    description: Generate Access token from refresh token
   *    produces:
   *      - application/json
   *    parameters:
   *      - in: body
   *        name: body
   *        description: Refresh token for generating access token
   *        schema:
   *            $ref: '#/components/schemas/refreshTokenPrams'
   *    responses:
   *      200:
   *        description: generated access token
   *        content:
   *          application/json
   *        schema:
   *          $ref: '#/components/schemas/refreshTokenResponse'
   *
   * @todo Add validation
   * @param {string} refreshToken
   * @return {Promise<RefreshTokenResponse>} regresh token
   */
  @Post('/refresh-token')
  public async regenerateAccessToken(@BodyParam('refreshToken') refreshToken: string): Promise<RefreshTokenResponseData> {
    const newAccessToken: string = await this.authService.regenerateAccessToken(refreshToken);
    return { accessToken: newAccessToken };
  }

  /**
   * @swagger
   * /auth/logout-all:
   *  get:
   *    tags:
   *      - "auth"
   *    description: Logout multiple locations
   *    response:
   *      204
   *
   * @param {Iuser} user
   * @return {Promise<void>}
   */
  @Get('/logout-all')
  @UseBefore(RequireAuth)
  @OnUndefined(204)
  public async logoutAll(@CurrentUser() user: IUser): Promise<void> {
    await this.authService.logoutAll(user._id);
    return;
  }
}
