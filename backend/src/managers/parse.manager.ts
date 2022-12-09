import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { execSync } from 'child_process';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CONFIG, IConfig } from '../config/config';
import axios, { AxiosError } from 'axios';
import * as FormData from 'form-data';
export interface ParseServiceResponseBody<T = any> {
  data: T;
  type: string;
}
@Injectable()
export class ParseManager {
  constructor(
    @Inject(CONFIG) private config: IConfig,
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
      const form = new FormData();
      form.append('file', file.buffer, file.originalname);
      form.append('headerIndex', headerIndex);

      const res = await axios.post<ParseServiceResponseBody<T>>(
        this.config.parseServiceUrl,
        form,
        {
          headers: {
            ...form.getHeaders(),
          },
        },
      );
      return res.data.data;
    } catch (error) {
      this.logger.error('Failed to parse xls to json', error, {
        parseServiceUrl: this.config.parseServiceUrl,
        error: error?.response?.data || error?.message || error,
        headerIndex,
      });
    }
  }
}
