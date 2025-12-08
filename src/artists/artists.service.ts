import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artist)
    private artistsRepository: Repository<Artist>,
  ) {}

  async create(dto: CreateArtistDto): Promise<Artist> {
    const artist = this.artistsRepository.create(dto);

    return this.artistsRepository.save(artist);
  }

  async findAll(): Promise<Artist[]> {
    return this.artistsRepository.find();
  }

  async findOne(id: string): Promise<Artist> {
    return this.artistsRepository.findOne({ where: { id } });
  }

  async update(id: string, dto: UpdateArtistDto): Promise<Artist> {
    let artist = await this.artistsRepository.findOne({ where: { id } });
    if (!artist) {
      return;
    }

    artist = this.artistsRepository.merge(artist, dto);

    return this.artistsRepository.save(artist);
  }

  async remove(id: string): Promise<Artist> {
    const artist = await this.artistsRepository.findOne({ where: { id } });
    if (!artist) {
      return;
    }
    await this.artistsRepository.delete(id);
    return artist;
  }
}
