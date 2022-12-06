import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { EntityManager, Repository } from 'typeorm';
import { ProductCalculator } from '../src/utils/product.mapper';
import { ProductEntity } from '../src/models/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../src/models/entities/category.entity';
import { MdbProduct } from '../src/models/entities/mdb-product.entity';
describe('ProductController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forFeature([ProductEntity, CategoryEntity, MdbProduct]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    return await app.get(EntityManager).query(
      `
        DELETE FROM Products;
        DELETE FROM Categories; 
        DELETE FROM MdbProducts; 
        `,
    );
  });

  it("Should insert all file's products into the DB", (done) => {
    // Arrange
    const expectedResult = [
      {
        description: 'Producto 1',
        code: '99999901',
        codeString: '99.99.99.01',
      },
      {
        description: 'Producto 2',
        code: '99999902',
        codeString: '99.99.99.02',
      },
      {
        description: 'Producto 3',
        code: '99999903',
        codeString: '99.99.99.03',
      },
    ];
    const path = resolve('test', 'data', 'insert.mdb');
    const file = readFileSync(path);
    // const form = new FormData();
    // form.append('file', file);
    // Act
    request(app.getHttpServer())
      .post('/products/mdb')
      .attach('file', file, 'insert.mdb')
      .expect(201)
      .end(async () => {
        // Assert
        const dbRes = await app
          .get(EntityManager)
          .query(
            'SELECT * FROM PRODUCTS WHERE Code in (99999901, 99999902, 99999903)',
          );
        expect(dbRes[0]).toEqual(expect.objectContaining(expectedResult[0]));
        expect(dbRes[1]).toEqual(expect.objectContaining(expectedResult[1]));
        expect(dbRes[2]).toEqual(expect.objectContaining(expectedResult[2]));
        done();
      });
  });

  it.each([
    [
      'update and insert',
      [
        {
          description: 'Producto Updated 1',
          code: '99999901',
          codeString: '99.99.99.01',
          utility: 0.3,
          listPrice: 56.19,
          vat: 0.21,
          dolar: 6.42,
          transport: 0.14,
          card: 0.23,
          cost: 38.51,
          price: 101,
          cardPrice: ProductCalculator.cardPrice(101, 0.23),
        },
        {
          description: 'Producto Updated 2',
          code: '99999902',
          codeString: '99.99.99.02',
          utility: 0.3,
          listPrice: 56.19,
          vat: 0.21,
          dolar: 6.42,
          transport: 0.14,
          card: 0.23,
          cost: 38.51,
          price: 202,
          cardPrice: ProductCalculator.cardPrice(202, 0.23),
        },
        {
          description: 'Producto Updated 3',
          code: '99999903',
          codeString: '99.99.99.03',
          utility: 0.3,
          listPrice: 56.19,
          vat: 0.21,
          dolar: 6.42,
          transport: 0.14,
          card: 0.23,
          cost: 38.51,
          price: 303,
          cardPrice: ProductCalculator.cardPrice(303, 0.23),
        },
        {
          description: 'Producto 4',
          code: '99999904',
          codeString: '99.99.99.04',
          utility: 0.3,
          listPrice: 56.19,
          vat: 0.21,
          dolar: 6.42,
          transport: 0.14,
          card: 0.23,
          cost: 38.51,
          price: 400,
          cardPrice: ProductCalculator.cardPrice(400, 0.23),
        },
      ],
      'upsert.mdb',
    ],
  ])(
    "Should %p all file's products into the DB",
    async (_msg, expectedResult, fileName) => {
      // Arrange
      const manager = app.get(EntityManager);
      const productRepository = manager.getRepository(ProductEntity);
      await productRepository.insert({
        code: +expectedResult[0].code,
        codeString: expectedResult[0].codeString,
        description: 'Exitent Product',
      });

      // Act
      const file = readFileSync(resolve('test', 'data', fileName));
      const res = await request(app.getHttpServer())
        .post('/products/mdb')
        .attach('file', file, fileName);
      const dbRes = await productRepository.find({
        order: { code: 'ASC' },
      });
      // Assert
      expect(res.statusCode).toBe(201);
      expect(dbRes.length).toEqual(expectedResult.length);
      expectedResult.forEach((item, index) => {
        expect(dbRes[index]).toEqual(expect.objectContaining(item));
      });
    },
  );
});
