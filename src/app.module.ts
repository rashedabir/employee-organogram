import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmConfigModule } from './config/database/typeorm-config.module';
import { TypeOrmConfigService } from './config/database/typeorm-config.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UserAuthModule } from './modules/user/users.module';
import { EmployeeModule } from './modules/employee/employee.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      ttl: 60, // Time to live (in seconds) of each throttling rule
      limit: 100, // Maximum number of requests per TTL cycle
    }),
    TypeOrmModule.forRootAsync({
      imports: [TypeOrmConfigModule],
      inject: [ConfigService],
      // Use useFactory, useClass, or useExisting
      // to configure the ConnectionOptions.
      name: TypeOrmConfigService.connectionName,
      // useClass: TypeOrmConfigService,
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: `${configService.get('DB_PASSWORD')}`,
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: false,
        autoLoadEntities: true,
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        seeds: [__dirname + '/seeds/**/*{.ts,.js}'],
        factories: [__dirname + '/factories/**/*{.ts,.js}'],
        cli: {
          migrationsDir: __dirname + '/migrations/',
        },
      }),
    }),
    RouterModule.register([
      {
        path: 'auth',
        module: UserAuthModule,
      },
    ]),
    UserAuthModule,
    EmployeeModule,
    // CatModule,
    // MediaManagerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: '/auth/', method: RequestMethod.ALL })
      .forRoutes('*');
  }
}
