import fs from 'fs';

export default abstract class Perpetual {
  /**
   * Determines if a given path exists
   * @param {string} path
   */
  public exists(path: string): boolean {
    return fs.existsSync(path);
  }
}
