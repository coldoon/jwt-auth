const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const sub_domain = '';

module.exports = function (app) {
    const swaggerOptions = {
      swaggerDefinition: {
        info: {
          title: "Library API JWT-AUTH",
          description: "Library API JWT-AUTH Information",
          version: "1.0.0",
          contact: {
            name: "Developer",
          },
          servers: ["http://localhost:4000"],
        },
        basePath: sub_domain,
      },
      apis: ["routes/*.js"],
    };
  
    
  
    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.use(`${sub_domain}/api-docs`, swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  };
  
