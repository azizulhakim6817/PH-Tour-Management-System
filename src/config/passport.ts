import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../app/modules/user/user.module";
import { Role } from "../app/modules/user/user.interface";
import { Strategy as LocalStrategy, VerifyFunction } from "passport-local";
import bcryptjs from "bcryptjs";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExist = await User.findOne({ email });
        /* if (!isUserExist) {
        return done("User dose not eixst!");
        } */
        if (!isUserExist) {
          return done(null, false, { message: "No Email exist!" });
        }
        // Google autheticate -----------------
        const isGoogleAuthenticed = isUserExist.auths.some(
          (providerObjects) => providerObjects.provider == "google"
        );

        if (isGoogleAuthenticed || !isUserExist.password) {
          return done(null, false, {
            message:
              "You have authenticated through Google. if you want to login with credential, then at first google a set a password your Gmail and then you can login with email and password.",
          });
        }

        // Password compare (hashed vs input)
        const isPasswordMatched = await bcryptjs.compare(
          password as string,
          isUserExist.password as string
        );

        if (!isPasswordMatched) {
          return done(null, false, { message: "Password does not match!" });
        }

        return done(null, isUserExist);
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

/* Google Authentication auto login user------------------------------------- */
passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "No email found!" });
        }

        let user = await User.findOne({ email });
        console.log(user);
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: email,
            picture: profile.photos?.[0].value,
            role: Role.USER,
            isVerified: true,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, user);
      } catch (error) {
        console.log("Goole Stategy error", error);
        return done(error);
      }
    }
  )
);

passport.serializeUser(
  (user: Express.User, done: (err: any, id?: unknown) => void) => {
    done(null, (user as any)._id);
  }
);
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error);
  }
});

/*Google auto user create : ------------
frontend:
-> localhost:5173/login?redirect=/booking 
-> localhost:8000/api/v1/auth/google?redirect=/booging
 -> passport -> google oauth consent -> gmail login -> successfull 
 -> callback URL <==> localhost:8000/api/v1/auth/google/callback -->  DB-store --> Token
 */

/* Bridge----Google--> user DB-store -> token ---> 
Custom -> email-password-role: user, name.. -> registration -> DB -> 1 -> User create
Google->req -> google -> successfull : JWT:token, role: user , email: email -> DB -> store
 
 */
