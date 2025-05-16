import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Medisync",
      version: "1.0.0",
      description: "API documentation for your app",
    },
    servers: [
      {
        url: "http://localhost:8500/", // adjust if needed
      },
    ],
  },
  apis: ["./docs/*.js"], // points to your Swagger doc files
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };