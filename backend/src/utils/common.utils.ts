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
}

export class ChunkUtil<T> {
  constructor(
    private items: T[],
    private size: number = 1,
    private delayBetweenChunksMs = 0,
  ) {}
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
      await this.sleep(this.delayBetweenChunksMs);
      chunk = this.next();
    }
    return;
  }

  async sleep(time: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, time);
    });
  }
}
