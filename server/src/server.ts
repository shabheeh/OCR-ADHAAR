import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { app } from "./app";

const PORT = process.env.PORT;
const SERVER_URL = process.env.SERVER_URL;

const server = http.createServer(app);

server.listen(PORT, () => console.log(`server is listening on ${SERVER_URL}`));
