import { ProductEntity } from '../../src/models/entities/product.entity';
import { IMdbProduct } from '../../src/models/mdb-product';
import { CommonUtils } from './common.utils';
import { CategoryEntity } from '../../src/models/entities/category.entity';
import { MdbProduct } from '../../src/models/entities/mdb-product.entity';
import { IXlsUpdateProduct } from '../models/xls-update-product';

export class ProductMapper {
  /**
   * Parses string codes like 01.01.01.02 to number like 01010102
   */
  static parseIntProductCode(code: string) {
    return parseInt(code.replace(/[.]/g, ''));
  }

  /**
   * Transforms percentages like 30 to 0.3 with no more than 2 decimals.
   */
  static toDecimalProportion(num: number) {
    return +(num / 100).toFixed(2);
  }
  /**
   * Makes sure only 2 decimals are used.
   */
  static toMoney(num: number): number {
    return +num.toFixed(2);
  }
  /**
   * Transform proportional multipliers like 1.3 (used to add a 30%) to 0.3.
   */
  static fromMultiplierToDecimalProportion(num: number) {
    return +(num - 1).toFixed(2);
  }

  static mdbProductToProductEntity(
    mdbProduct: IMdbProduct,
    categories: CategoryEntity[],
  ): ProductEntity {
    const category = categories.find(
      (c) => c.description === CommonUtils.cleanDescription(mdbProduct.rubro),
    ) || {
      description: CommonUtils.cleanDescription(mdbProduct.rubro),
    };
    return {
      code: ProductMapper.parseIntProductCode(mdbProduct.codigo),
      codeString: mdbProduct.codigo,
      description: CommonUtils.cleanDescription(mdbProduct.descripcion),
      utility: ProductMapper.fromMultiplierToDecimalProportion(
        mdbProduct.utilidad,
      ),
      vat: ProductMapper.toDecimalProportion(mdbProduct.iva),
      transport: ProductMapper.toDecimalProportion(mdbProduct.flete),
      card: ProductMapper.toDecimalProportion(mdbProduct.tarjeta),
      listPrice: ProductMapper.toMoney(mdbProduct.pl),
      cost: ProductMapper.toMoney(mdbProduct.costo),
      price: ProductMapper.toMoney(mdbProduct.precio),
      dolar: ProductMapper.toMoney(mdbProduct.dolar),
      cardPrice: ProductCalculator.cardPrice(
        ProductMapper.toMoney(mdbProduct.precio),
        ProductMapper.toDecimalProportion(mdbProduct.tarjeta),
      ),
      category,
      // Temp fields until discounts array can be used.
      bonus: ProductMapper.toDecimalProportion(mdbProduct.bonif),
      bonus2: ProductMapper.toDecimalProportion(mdbProduct.bonif2),
      cashDiscount: ProductMapper.toDecimalProportion(mdbProduct.caja1),
      cashDiscount2: ProductMapper.toDecimalProportion(mdbProduct.caja2),
    };
  }

  static mdbJsonToMdbProductEntity(mdbProduct: IMdbProduct): MdbProduct {
    return {
      codigo: mdbProduct.codigo,
      codigoNumero: ProductMapper.parseIntProductCode(mdbProduct.codigo),
      descripcion: CommonUtils.cleanDescription(mdbProduct.descripcion),
      utilidad: ProductMapper.fromMultiplierToDecimalProportion(
        mdbProduct.utilidad,
      ),
      iva: ProductMapper.toDecimalProportion(mdbProduct.iva),
      flete: ProductMapper.toDecimalProportion(mdbProduct.flete),
      tarjeta: ProductMapper.toDecimalProportion(mdbProduct.tarjeta),
      pl: ProductMapper.toMoney(mdbProduct.pl),
      costo: ProductMapper.toMoney(mdbProduct.costo),
      precio: ProductMapper.toMoney(mdbProduct.precio),
      dolar: ProductMapper.toMoney(mdbProduct.dolar),
      precioTarjeta: ProductCalculator.cardPrice(
        ProductMapper.toMoney(mdbProduct.precio),
        ProductMapper.toDecimalProportion(mdbProduct.tarjeta),
      ),
      rubro: CommonUtils.cleanDescription(mdbProduct.rubro),
      bonif: ProductMapper.toDecimalProportion(mdbProduct.bonif),
      bonif2: ProductMapper.toDecimalProportion(mdbProduct.bonif2),
      caja1: ProductMapper.toDecimalProportion(mdbProduct.caja1),
      caja2: ProductMapper.toDecimalProportion(mdbProduct.caja2),
    };
  }

  /**
   * File Header:
   * Código | Descripción | Precio | Bonif1 |	Bonif2 | Neto Final con IVA | Precio Cliente con Margen | Estado
   * To avoid troubles with words with special sybmols like `Código` get the values and extract by order.
   */
  static xlsJsonToXlsProductEntityt(
    xlsProduct: Record<string, string>,
  ): IXlsUpdateProduct {
    const values = Object.values(xlsProduct);
    return {
      codigoString: values[0],
      codigo: ProductMapper.parseIntProductCode(values[0]),
      precio: ProductMapper.toMoney(parseFloat(values[2])),
      bonificacion: ProductMapper.toDecimalProportion(
        parseFloat(values[3]) || 0,
      ),
      bonificacion2: ProductMapper.toDecimalProportion(
        parseFloat(values[4]) || 0,
      ),
    };
  }

  static xlsProductToProductEntity(
    xlsProduct: IXlsUpdateProduct,
  ): Partial<ProductEntity> {
    return {
      code: xlsProduct.codigo,
      price: xlsProduct.precio,
      bonus: xlsProduct.bonificacion,
      bonus2: xlsProduct.bonificacion2,
    };
  }
}

export class ProductCalculator {
  // static cost(listPrice: number, vat: number, discounts: IDiscount[] = []): number {
  //   const totalDiscount: number = sumBy(discounts, (d) => d.amount);
  //   const cost = (listPrice * (1 + vat - totalDiscount)).toFixed(2);
  //   return parseFloat(cost);
  // }

  static price(cost: number, utility: number, transport: number): number {
    return parseFloat((cost * (1 + utility + transport)).toFixed(2));
  }

  static cardPrice(price: number, card: number): number {
    return parseFloat((price * (1 + card)).toFixed(2));
  }
}
