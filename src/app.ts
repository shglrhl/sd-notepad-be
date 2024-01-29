import express from "express";
import userRoutes from "./routes/userRoutes";
import noteRoutes from "./routes/noteRoutes";

import * as swaggerDocument from "./swagger/swagger_output.json";
import swaggerUi from "swagger-ui-express";
import authenticateMiddleware from "./middleware/authenticate";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/notes", authenticateMiddleware, noteRoutes);

app.listen(PORT, () => {
	console.info(`Server is running on port ${PORT}`);
});

export default app;
