import { DataSource } from 'typeorm';
import { Album } from './albums/entities/album.entity';
import { Artist } from './artists/entities/artist.entity';
import { Favorites } from './favorites/entities/favorites.entity';
import { Track } from './tracks/entities/track.entity';
import { User } from './users/entities/user.entity';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const myDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: +process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  database: process.env.POSTGRES_DB || 'postgres',
  entities: [User, Artist, Album, Track, Favorites],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  dropSchema: true,
  synchronize: false,
  migrationsRun: true,
});

export default myDataSource;
