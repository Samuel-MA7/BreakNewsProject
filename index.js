import express from "express";
import connectDatabase from "./src/database/db.js";
import dotenv from "dotenv";

//Imported routes
import userRoute from "./src/routes/user.route.js";
import authRoute from "./src/routes/auth.route.js";
import newsRoute from "./src/routes/news.route.js";
import swaggerRoute from "./src/routes/swagger.route.js";

dotenv.config();
const port = process.env.PORT || 3000;
const app = express();

connectDatabase();
app.use(express.json());

//Main routes
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/news", newsRoute);
app.use("/doc", swaggerRoute);

app.listen(port, () => console.log(`Server running on port ${port}!`));