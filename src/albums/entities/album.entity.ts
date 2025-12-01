export class AlbumEntity {
  id: string; // uuid
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}
