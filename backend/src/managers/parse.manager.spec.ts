import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ParseManager } from './parse.manager';

describe('ParseManager', () => {
  let parseManager: ParseManager;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [Logger, ParseManager],
    }).compile();

    parseManager = app.get<ParseManager>(ParseManager);
  });

  describe('xlsToJson', () => {
    it('Should parse xls to json', async () => {
      const path = resolve('test', 'data', 'bulk-update.xls');
      console.log(path);
      const file = readFileSync(path);
      const json = await parseManager.xlsToJson(
        { buffer: file.buffer } as any,
        2,
      );
      expect(json).toEqual([
        expect.objectContaining({
          Código: '00.00.00.01',
          Descripción: 'Test Product 1',
          Precio: 10,
          Bonif1: 40,
          Bonif2: 0,
          'Neto Final con IVA': 393.59530980000005,
          'Precio Cliente con Margen': 590.3929647,
          Estado: ' ',
        }),
        expect.objectContaining({
          Código: '00.00.00.02',
          Descripción: 'Test Product 2',
          Precio: 10,
          Bonif1: 40,
          Bonif2: 0,
          'Neto Final con IVA': 393.59530980000005,
          'Precio Cliente con Margen': 590.3929647,
          Estado: ' ',
        }),
      ]);
    });
  });
});
