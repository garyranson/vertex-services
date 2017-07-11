export class Intern {
  private cache: { [key: string]: string } = {};

  get(str: string): string {
    return this.cache[str] || (this.cache[str] = str);
  }

  has(str: string): boolean {
    return !!this.cache[str];
  }
}
