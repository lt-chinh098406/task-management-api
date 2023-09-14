import { DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('Task Management API')
  .setDescription('Task Management API description')
  .setVersion('1.0')
  .addTag('task management')
  .build();

const swaggerConfig = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  customSiteTitle: 'Task Management API',
};

export { config, swaggerConfig };
