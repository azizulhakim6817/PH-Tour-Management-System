import { envVars } from "../../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.module";
import bcryptjs from "bcryptjs";

export const seedSupperAdmin = async () => {
  try {
    const isSupperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });
    if (isSupperAdminExist) {
      console.log("Super Admin already exist");
      return;
    }
    console.log("Trying to create Supper Admin");

    const hasPassword = await bcryptjs.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Supper Admin",
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hasPassword,
      auths: [authProvider],
      isVerified: true,
    };

    const supperAdmin = await User.create(payload);
    console.log("Supper Admin creaded successfully! \n");
    console.log(supperAdmin);
  } catch (error) {
    console.log(error);
  }
};
