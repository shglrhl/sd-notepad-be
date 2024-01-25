import express from "express";
import userRoutes from "./routes/userRoutes";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
	console.info(`Server is running on port ${PORT}`);
});

export default app;
