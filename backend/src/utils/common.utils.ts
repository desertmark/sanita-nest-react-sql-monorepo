import { camelCase, take, drop } from 'lodash';

export class CommonUtils {
  static capitalize(str: string) {
    if (!str) {
      return undefined;
    }
    return str
      .toString()
      .toLowerCase()
      .replace(/\b[a-z]/g, (char) => char.toUpperCase());
  }

  static cleanSpaces(str: string) {
    if (!str) {
      return undefined;
    }
    return str.toString().trim().replace(/\s+/g, ' ');
  }

  static parseFloatCustom(n: string) {
    return parseFloat(n.replace(',', '.'));
  }

  static toCamelCaseRecord<T>(record: Record<string, any>): T {
    const camelRecord = {};
    Object.entries(record).forEach(
      ([key, val]) => (camelRecord[camelCase(key)] = val),
    );
    return camelRecord as T;
  }

  static cleanDescription(description: string): string {
    return (
      CommonUtils.capitalize(CommonUtils.cleanSpaces(description)) ||
      'No description'
    );
  }

  // static getChunks<T>(array: T[], size = 10): T[][] {
  //   const chunks = [];
  //   for (let i = 0; i < array.length; i = i + size) {
  //     const temp = [];
  //     for (let j = i; j < i + size && j < array.length; j++) {
  //       temp.push(array[j]);
  //     }
  //     chunks.push(temp);
  //   }
  //   return chunks;
  // }
}

export class ChunkUtil<T> {
  constructor(private items: T[], private size: number = 1) {}
  public page = 0;

  next(): T[] {
    const chunk = take(drop(this.items, this.page * this.size), this.size);
    this.page++;
    return chunk;
  }

  async doInChunks(cb: (items: T[], page?: number) => Promise<void>) {
    let chunk = this.next();
    while (chunk?.length) {
      await cb(chunk, this.page);
      chunk = this.next();
    }
    return;
  }
}
