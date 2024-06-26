import { DataSource } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

export const AppDataSource = new DataSource({
  type: 'postgres', // or "mysql", "sqlite", etc.
  host: `${process.env.DB_HOST}`,
  port: +process.env.DB_PORT,
  username: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  synchronize: false, // Set to false for production
  logging: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // Your entities here
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'], // Your migrations here
  subscribers: [__dirname + '/subscriber/**/*{.ts,.js}'],
  migrationsTableName: 'migrations',
});

// Initialize the data source
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
