import { Service, Inject } from 'typedi';
import moment from 'moment';

import { IOfferModel } from '../models/Offer';
import { IOffer } from '../models/interfaces/IOffer';
import SystemError from './errors/SystemError';

@Service()
export class OfferService {
  constructor(@Inject('offerModel') private offerModel: IOfferModel) {}

  /**
   * isValidOffer
   * @param offerCode string
   */
  public async isValidOffer(offerCode: string) {
    let offer: IOffer | null;
    try {
      offer = await this.offerModel.findOne({ offerCode });
    } catch (error) {
      throw new SystemError({ error });
    }
    if (!offer) {
      return false;
    }
    const startDate = moment(offer.startDate).format('YYYY-MM-DD');
    const endDate = moment(offer.endDate).format('YYYY-MM-DD');
    const range = moment(moment().format('YYYY-MM-DD')).isBetween(startDate, endDate, undefined, '[]');
    if (range) {
      return true;
    }
    return false;
  }
}
