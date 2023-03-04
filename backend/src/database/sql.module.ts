import { Logger, Module } from '@nestjs/common';
import {
  InjectEntityManager,
  TypeOrmModule,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { ConfigModule } from '../config/config.module';
import { CategoryEntity } from '../models/entities/category.entity';
import { MdbProduct } from '../models/entities/mdb-product.entity';
import { ProductEntity } from '../models/entities/product.entity';
import { EntityManager } from 'typeorm';
import { XlsProduct } from '../models/entities/xls-product.entity';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory({ config }: ConfigService) {
        return {
          type: 'mssql',
          database: config.db.database,
          authentication: {
            type: 'default',
            options: {
              userName: config.db.user,
              password: config.db.password,
            },
          },
          host: config.db.host,
          port: +config.db.port,
          entities: [ProductEntity, CategoryEntity, MdbProduct, XlsProduct],
          synchronize: !!config.db.generateSchema,
          extra: {
            validateConnection: false,
            trustServerCertificate: true,
          },
        } as TypeOrmModuleOptions;
      },
      inject: [ConfigService],
    }),
  ],
})
export class SqlModule {
  constructor(
    @InjectEntityManager() private manager: EntityManager,
    private logger: Logger,
  ) {
    this.createMigrateMdbProductsSP();
  }

  private async createMigrateMdbProductsSP() {
    try {
      this.logger.log('Creating migrateMdbProducts store procedure...');
      await this.manager.query(`
        IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'migrateMdbProducts')
	        DROP PROCEDURE migrateMdbProducts
      `);
      await this.manager.query(`
        CREATE PROCEDURE migrateMdbProducts
        AS   
          BEGIN
            -- INSERT CATEGORIES --
            INSERT INTO Categories (description)
            SELECT DISTINCT rubro as description FROM MdbProducts WHERE rubro NOT IN (SELECT description FROM Categories c)
            
            -- INSER PRODUCTS -- 
            INSERT INTO Products (code,             codeString, description, utility,  listPrice, cost,  vat, dolar, transport, card,    price,  cardPrice,     bonus, bonus2, cashDiscount, cashDiscount2, categoryId) 
            SELECT 		  	    mp.codigoNumero, mp.codigo,     mp.descripcion, mp.utilidad, mp.pl,        mp.costo, mp.iva, mp.dolar, mp.flete, 	mp.tarjeta, mp.precio, mp.precioTarjeta, mp.bonif, mp.bonif2, mp.caja1,        mp.caja2,          c.id
            FROM MdbProducts mp
              INNER JOIN Categories c on c.description = mp.rubro
            WHERE codigoNumero NOT IN (SELECT code FROM Products)
          
            -- UPDATE PRODUCTS --
            UPDATE Products
              SET code = mp.codigoNumero,
                 codeString = mp.codigo,
                 description = mp.descripcion,
                 utility = mp.utilidad,
                 listPrice = mp.pl,
                 cost = mp.costo,
                 vat = mp.iva,
                 dolar = mp.dolar,
                 transport = mp.flete,
                 card = mp.tarjeta,
                 price = mp.precio,
                 cardPrice = mp.precioTarjeta,
                 bonus = mp.bonif,
                 bonus2 = mp.bonif2,
                 cashDiscount = mp.caja1,
                 cashDiscount2 = mp.caja2,
                 categoryId = c.id
            FROM Products p 
              INNER JOIN MdbProducts mp ON mp.codigoNumero = p.code
              INNER JOIN Categories c ON c.description = mp.rubro;
          END;
    `);
    } catch (error) {
      this.logger.error('Failed to create migrateMdbProducts');
    }
  }
}
