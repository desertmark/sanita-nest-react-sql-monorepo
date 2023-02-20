import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { execSync } from 'child_process';
import { Injectable, Logger } from '@nestjs/common';
import { read, utils } from 'xlsx';

type CellLetter = string;
type CellValue = string;

export interface ParseServiceResponseBody<T = any> {
  data: T;
  type: string;
}
@Injectable()
export class ParseManager {
  constructor(
    // @Inject(CONFIG) private config: IConfig,
    private logger: Logger,
  ) {}

  async mdbToJson<T>(file: Express.Multer.File, tableName: string): Promise<T> {
    const path = uuidv4();
    try {
      this.logger.debug('Writing mdb file...');
      writeFileSync(path, file.buffer);

      this.logger.debug('Using mdb-tools to parse...');
      execSync(`mdb-json ${path} ${tableName} > out.json`);

      // NOTE: out.json content are bunch of independent object each row in one line but they are not inside an array.
      this.logger.debug('Reading mdb-tools output...');
      const text = readFileSync('out.json').toString();

      /**
       * Before we parse we need to edit content to be a valid array JSON we can parse.
       * Add a , at the end of every line by replacing `}` with `},`. Pop the last `,` and `\n` using `slice(0,-2)` all of this inside `[...]`
       */
      this.logger.debug('Fixing mdb-tools json output to be valid json....');
      const jsonString = `[${text.replace(/}/g, '},').slice(0, -2)}]`;

      this.logger.debug('Parsing json text to a real JSON object....');
      const json = JSON.parse(jsonString);

      return json as T;
    } catch (error) {
      this.logger.error('Failed to parse mdb to json', {
        error,
        file,
        tableName,
      });
      throw error;
    } finally {
      this.logger.debug('Removing garbage', { path });
      unlinkSync(path);
      unlinkSync('out.json');
    }
  }

  async xlsToJson<T>(
    file: Express.Multer.File,
    headerIndex: number,
  ): Promise<T> {
    try {
      // Código | Descripción | Precio | Bonif1 |	Bonif2 | Neto Final con IVA | Precio Cliente con Margen | Estado
      const json = [];
      // Read file and get cell matrix
      const rows = this.readFirstSheetRows(file.buffer);
      // Get Header Row
      const headerKeys = rows[headerIndex];
      // Get Data Rows
      const dataRows = rows
        .splice(headerIndex + 1)
        .map((dr) => Object.values(dr));
      // For each data row use header to build item
      dataRows.forEach((dr) => {
        const item = {};
        headerKeys.forEach((key, index) => {
          item[key] = dr[index];
        });
        json.push(item);
      });
      return json as T;
    } catch (error) {
      this.logger.error('Failed to parse xls to json', error);
      throw error;
    }
  }

  private readFirstSheetRows(fileBuffer: Buffer): string[][] {
    const wb = read(fileBuffer, { type: 'buffer' });
    const firstSheet = wb.Sheets[wb.SheetNames[0]];
    const rows = utils
      .sheet_to_json<string>(firstSheet, { header: 'A' })
      ?.map((dr) => Object.values(dr));
    return rows;
  }
}
