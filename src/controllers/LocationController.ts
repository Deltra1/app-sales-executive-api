import { JsonController, UseBefore, Get, HttpCode, CurrentUser } from 'routing-controllers';

import { RequireAuth } from '../middlewares/AuthMiddleware';
import LocationService from '../services/LocationService';
import IUser from '../models/interfaces/IUser';

@UseBefore(RequireAuth)
@JsonController('/location')
export class LocationController {
  public constructor(private locationService: LocationService) {}

  /**
   * @swagger
   * /location/municipality:
   *  get:
   *    tags:
   *      - "location"
   *    description: Get all municipalies
   *    produces:
   *      - application/json
   *    responses:
   *      200:
   *        $ref: '#/components/responses/getAllMunicipalitiesResponse'
   */
  @HttpCode(200)
  @Get('/municipality')
  public async getAllMunicipalities() {
    const municipalities = await this.locationService.getAllMunicipalities();
    return municipalities.map((municipality: any) => municipality.toJSON());
  }

  /**
   * getAllRoutes
   * @param user IUser
   */
  @HttpCode(200)
  @Get('/routes')
  public async getAllRoutes(@CurrentUser() user: IUser) {
    const routes = await this.locationService.getAllRoutes(user);
    return routes.map((route: any) => route.toJSON());
  }
}
