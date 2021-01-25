import mongoose from 'mongoose';

import config from '../../src/config';
import User from '../../src/models/User';

mongoose.connect(config.db.mongodbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});
export const initalSalesExecutiveUser = {
  userId: 'aid00000',
  name: 'Sales Exec',
  email: 'sales@sales.com',
  phoneNumber: '1234567890',
  password: config.company.defaultUserPassword,
  roleId: config.company.salesExecutiveRoleId,
  createdBy: mongoose.Types.ObjectId(),
  updatedBy: mongoose.Types.ObjectId(),
};

export default async function runProcess() {
  // create collections
  // create userRole
  const userRoleSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        unique: true,
        require: true,
        minlength: 3,
        maxLength: 255,
      },
      createdBy: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      updatedBy: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
    },
    {
      timestamps: true,
      autoCreate: true,
    },
  );

  const userRole = mongoose.model('UserRole', userRoleSchema);

  const session = await mongoose.startSession();
  try {
    // delete all data

    // delete all userRole
    await userRole.deleteMany({});
    // delete all users
    await User.deleteMany({});

    session.startTransaction();

    // add salesExecutive role
    const userRoleObj = new userRole({
      _id: config.company.salesExecutiveRoleId,
      name: 'Sales Executive',
      createdBy: mongoose.Types.ObjectId(),
      updatedBy: mongoose.Types.ObjectId(),
    });

    await userRoleObj.save({ session });

    // add sales executive user

    const user = new User({ ...initalSalesExecutiveUser });
    await session.commitTransaction();
    await user.save();
  } catch (e) {
    session.abortTransaction();
    throw e;
  }
}
