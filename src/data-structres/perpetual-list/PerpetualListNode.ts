import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { Address } from '../../common/types';
import Malloc from '../../helpers/malloc';

export default class PerpetualListNode<T> {
  private address: Address = Malloc();
  public next: Address = 'NULL';
  public prev: Address = 'NULL';
  public data: T;
  private nodePath: string;

  constructor(listLocation: string, data: T) {
    const objsDir: string = path.join(listLocation, 'objects');
    this.nodePath = path.join(objsDir, this.address!.toString());
    this.data = data;
    writeFileSync(this.nodePath, `${this.prev}\n${this.next}\n\n${this.data}`);
  }

  public getAddress(): Address {
    return this.address;
  }

  public setNext(next: Address): void {
    const buff: Buffer = readFileSync(this.nodePath);
    const lines: Array<Address> = buff.toString().split('\n');
    lines[1] = next;
    let cont = '';
    lines.forEach((l) => (cont += l + '\n'));
    writeFileSync(this.nodePath, cont);
  }
}
