import { app } from "./app";

const PORT = process.env.SERVER_URL;
const SERVER_URL = process.env.SERVER_URL;

app.listen(PORT, () => console.log("Server is listening on", SERVER_URL));
