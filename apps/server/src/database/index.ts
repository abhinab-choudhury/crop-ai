import mongoose from "mongoose";
import env from "@/lib/env";

await mongoose.connect(env.DATABASE_URL).catch((error) => {
  console.log("Error connecting to database:", error);
});

const client = mongoose.connection.getClient().db(env.DATABASE_NAME);

export { client };
