import { BadRequestException } from '@nestjs/common';
import * as Papa from 'papaparse';

export class MovieFileParser {
  static parse(file: Express.Multer.File): any[] {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const ext = file.originalname.split('.').pop()?.toLowerCase();
    const content = file.buffer.toString('utf-8');
    let parsedData: any[] = [];

    if (ext === 'json') {
      try {
        parsedData = JSON.parse(content);
        if (!Array.isArray(parsedData)) {
          parsedData = [parsedData];
        }
      } catch (err) {
        throw new BadRequestException('Invalid JSON format');
      }
    } else if (ext === 'csv') {
      const parsed = Papa.parse(content, { header: true, skipEmptyLines: true });
      if (parsed.errors.length > 0) {
        throw new BadRequestException('Invalid CSV format');
      }
      parsedData = parsed.data;
    } else {
      throw new BadRequestException('Unsupported file format. Use CSV or JSON');
    }

    return parsedData;
  }
}
