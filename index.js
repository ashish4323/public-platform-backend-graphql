import express from "express";
import cors from "cors";
import createApolloGraphqlServer from "./graph/index.js";
import { expressMiddleware } from "@apollo/server/express4";
import dotenv from "dotenv";
import mongoose from "mongoose";
import graphqlUploadExpress from "graphql-upload/graphqlUploadExpress.mjs";
import { decodeTokenAndFetchUser } from "./contexts/auth.js";

async function init() {
  const app = express();
  const PORT = process.env.PORT || 8000;

  dotenv.config();
  app.use(express.json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  // connection to database
  mongoose
    .connect(process.env.CONNECTION_URL)
    .then(() => console.log("Database Connected"))
    .catch(() => console.log("Some error occured "));

  // setting up the graphql server
  app.use(graphqlUploadExpress());
  app.use(
    "/graphql",
    expressMiddleware(await createApolloGraphqlServer(), {
      context: decodeTokenAndFetchUser,
    })
  );

  // starting the server
  app.listen(PORT, () => `Server is Running at PORT : ${8000}`);
}

init();
