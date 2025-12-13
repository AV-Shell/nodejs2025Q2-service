import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { FavoritesModule } from './favorites/favorites.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Album } from './albums/entities/album.entity';
// import { Artist } from './artists/entities/artist.entity';
// import { Favorites } from './favorites/entities/favorites.entity';
// import { Track } from './tracks/entities/track.entity';
// import { User } from './users/entities/user.entity';
import myDataSource from './ormconfig';
import { LoggerMiddleware } from './logger/logger.middleware';
import { LoggerModule } from './logger/logger.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      ...myDataSource.options,
      // type: 'postgres',
      // host: process.env.POSTGRES_HOST,
      // port: +process.env.POSTGRES_PORT,
      // username: process.env.POSTGRES_USER,
      // password: process.env.POSTGRES_PASSWORD,
      // database: process.env.POSTGRES_DB,
      // dropSchema: true,
      // synchronize: true,
      // migrationsRun: false,
      // migrations: ['src/migrations/*'],
      // logging: false,
      // entities: [User, Album, Artist, Favorites, Track],
      // autoLoadEntities: true,
    }),
    UsersModule,
    TracksModule,
    ArtistsModule,
    AlbumsModule,
    FavoritesModule,
    LoggerModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

console.log({
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  envFilePath: '.env',
});
