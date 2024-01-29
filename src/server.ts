import app from "./app";

// Need to separate the app and server for testing purposes
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
