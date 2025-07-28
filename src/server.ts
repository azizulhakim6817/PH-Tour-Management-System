import mongoose from "mongoose";
import { Server } from "http";
import app from "./app";
import { envVars } from "./config/env";
import { seedSupperAdmin } from "./app/utils/seedSupperAdmin";

let server: Server;

const startserver = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Connected to Database");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is listing to port ${envVars.PORT} `);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await startserver();
  //Seed Supper Admin default Auto create and setup --
  await seedSupperAdmin();
})();

//*1. Unhandle rejection error--(Server/computer->-crahs-off/shudown)-------------
process.on("unhandledRejection", (err) => {
  console.log("Unhandle Rejection detected... server shut down... ", err);
  if (server) {
    server.close();
    process.exit(1);
  }
  process.exit(1);
});
/* Promise.reject(new Error("I forgot to catch promise")).catch((err) => {
  console.log("Caught error: ", err.message);
}); */

//*2. Uncaught rejection error--(let a, console, any right -> server-error-crash)--
process.on("uncaughtException", (err) => {
  console.log("Unhandle Rejection detected... server shut down... ", err);
  if (server) {
    server.close();
    process.exit(1);
  }
  process.exit(1);
});
//throw new Error("I forgot to handle this local error");

//*3. Single termination sigterm--(cloud flatform--AWS-OFF/shudown)-server-error-crahs--
/* process.on("SIGINT", () => {
  console.log("Sigterm single recieve .. server shut down... ");
  if (server) {
    server.close();
    process.exit(1);
  }
  process.exit(1);
}); */
