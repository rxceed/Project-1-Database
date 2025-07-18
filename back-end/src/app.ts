import express from "express";
import routes from "./routes";
import bodyparser from "body-parser";
import { errorHandler } from "./middlewares";
import cors from "cors";
import 'dotenv/config';

const app = express();

app.use(cors());
app.use(bodyparser.json());

app.use("/", routes);

app.use(errorHandler);


export default app;