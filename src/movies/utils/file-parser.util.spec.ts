import { BadRequestException } from '@nestjs/common';
import { MovieFileParser } from './file-parser.util';

describe('MovieFileParser', () => {
  it('should throw error if no file provided', () => {
    expect(() => MovieFileParser.parse(null as any)).toThrow(
      new BadRequestException('No file provided'),
    );
  });

  it('should parse valid JSON', () => {
    const mockFile: Partial<Express.Multer.File> = {
      originalname: 'movies.json',
      buffer: Buffer.from(JSON.stringify([{ title: 'Inception' }])),
    };

    const result = MovieFileParser.parse(mockFile as Express.Multer.File);
    expect(result).toEqual([{ title: 'Inception' }]);
  });

  it('should wrap single JSON object in array', () => {
    const mockFile: Partial<Express.Multer.File> = {
      originalname: 'movies.json',
      buffer: Buffer.from(JSON.stringify({ title: 'Inception' })),
    };

    const result = MovieFileParser.parse(mockFile as Express.Multer.File);
    expect(result).toEqual([{ title: 'Inception' }]);
  });

  it('should throw error for invalid JSON', () => {
    const mockFile: Partial<Express.Multer.File> = {
      originalname: 'movies.json',
      buffer: Buffer.from('invalid-json'),
    };

    expect(() => MovieFileParser.parse(mockFile as Express.Multer.File)).toThrow(
      new BadRequestException('Invalid JSON format'),
    );
  });

  it('should parse valid CSV', () => {
    const csvContent = 'title,genre\nInception,Sci-Fi';
    const mockFile: Partial<Express.Multer.File> = {
      originalname: 'movies.csv',
      buffer: Buffer.from(csvContent),
    };

    const result = MovieFileParser.parse(mockFile as Express.Multer.File);
    expect(result).toEqual([{ title: 'Inception', genre: 'Sci-Fi' }]);
  });

  it('should throw error for unsupported format', () => {
    const mockFile: Partial<Express.Multer.File> = {
      originalname: 'movies.txt',
      buffer: Buffer.from('Some text'),
    };

    expect(() => MovieFileParser.parse(mockFile as Express.Multer.File)).toThrow(
      new BadRequestException('Unsupported file format. Use CSV or JSON'),
    );
  });
});
