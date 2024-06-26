import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres', // or "mysql", "sqlite", etc.
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: '2155',
  database: 'postgres',
  synchronize: false, // Set to false for production
  logging: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'], // Your entities here
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'], // Your migrations here
  subscribers: [],
});

// Initialize the data source
AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
