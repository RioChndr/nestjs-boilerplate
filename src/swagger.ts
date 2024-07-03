import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function initSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Swagger API')
    .setDescription('API description')
    .addBearerAuth();

  // split by comma and add multiple servers
  const serverSwagger =
    process.env.SWAGGER_SERVER_URL || 'http://localhost:3000|Localhost';

  serverSwagger.split(',').forEach((server) => {
    const [url, name] = server.split('|');
    config.addServer(url, name);
  });

  const document = SwaggerModule.createDocument(app, config.build());
  const apiUrl = process.env.SWAGGER_URL || 'documentation';
  SwaggerModule.setup(apiUrl, app, document);
}
