import { Schema, model, Model } from 'mongoose';
import { IMunicipality } from './interfaces/IMunicipality';

const municipalityScheme = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
    autoCreate: true,
  },
);

municipalityScheme.methods.toJSON = function toJSON() {
  const municiaplity = this.toObject();
  municiaplity.id = municiaplity._id.toString();
  delete municiaplity._id;
  delete municiaplity.__v;
  delete municiaplity.createdBy;
  delete municiaplity.updatedBy;
  delete municiaplity.createdAt;
  delete municiaplity.updatedAt;
  return municiaplity;
};

export interface IMunicipalityModel extends Model<IMunicipality> {}

export default model<IMunicipality>('Municipality', municipalityScheme);
