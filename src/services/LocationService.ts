import { IMunicipalityModel } from '../models/Municipality';
import { Inject } from 'typedi';
import { IMunicipality } from '../models/interfaces/IMunicipality';
import SystemError from './errors/SystemError';
import { IRouteModel } from '../models/Route';
import { IRoute } from '../models/interfaces/IRoute';
import IUser from '../models/interfaces/IUser';
import ServiceError from './errors/ServiceError';

export default class LocationService {
  public constructor(
    @Inject('municipalityModel') private municipalityModel: IMunicipalityModel,
    @Inject('routeModel') private routeModel: IRouteModel,
  ) {}

  /**
   * getMunicipalityById
   * @param id string
   */
  public async getMunicipalityById(id: string): Promise<IMunicipality | null> {
    const municipality = await this.municipalityModel.findById(id);
    return municipality;
  }

  /**
   * getAllMunicipalities
   */
  public async getAllMunicipalities(): Promise<IMunicipality[]> {
    let municipalities: IMunicipality[] = [];
    try {
      municipalities = await this.municipalityModel.find();
    } catch (error) {
      throw new SystemError({ error });
    }
    return municipalities;
  }

  /**
   * getAllRoutes
   * @param user IUser
   */
  public async getAllRoutes(user: IUser): Promise<IRoute[]> {
    let routes: IRoute[] = [];
    try {
      routes = await this.routeModel.find({ client: user.client });
    } catch (error) {
      throw new SystemError({ error });
    }
    return routes;
  }

  /**
   * getRouteById
   * @param id string
   * @param user IUser
   */
  public async getRouteById(id: string, user: IUser): Promise<IRoute> {
    let route: IRoute | null;
    try {
      route = await this.routeModel.findById(id);
    } catch (error) {
      throw new SystemError({ error });
    }
    if (!route) {
      throw new ServiceError({ message: 'Route not found', httpCode: 404 });
    }
    if (route.client.toString() !== user.client.toString()) {
      throw new ServiceError({ message: 'Invalid user', httpCode: 400 });
    }
    return route;
  }
}
