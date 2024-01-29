const swaggerDefinition = {
	openapi: "3.0.0",
	info: {
		title: "Express API for Note-taking App",
		version: "1.0.0",
		description: "",
	},
	servers: [
		{
			url: "http://localhost:3000",
			description: "Development server",
		},
	],
};

const options = {
	swaggerDefinition,
	apis: ["./src/routes/*.ts"],
};

export default options;
