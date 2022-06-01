import fs, { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { Address } from '../../common/types';
import PerpetualListNode from './PerpetualListNode';

/**
 * Creates a list that will be stored a the given location
 */
export default class PerpetualList<T> {
  private location: string;
  /**
   * Crates a new perpetual list
   * @param {string} name The name of the list
   * @param {string} location The path where the list will be stored
   */
  constructor(name: string, location: string) {
    this.location = path.join(path.resolve(location), name);
    const headPath: string = path.join(this.location, 'HEAD');
    const infoPath: string = path.join(this.location, '.list');
    const objDir: string = path.join(this.location, 'objects');
    // If list does not exist, then create list
    !this.exists(this.location) && fs.mkdirSync(this.location);
    // If head file does not exist, then create it
    !this.exists(headPath) && fs.writeFileSync(headPath, 'NULL');
    // If list info file does not exist, then create it
    !this.exists(infoPath) &&
      fs.writeFileSync(infoPath, `${name}\n${this.location}\n0`);
    // If dir to store nodes does not exist, then create it
    !this.exists(objDir) && fs.mkdirSync(objDir);
  }

  /**
   * Inserts a new element at the beginning of the list
   * @param {T} data Data of the element to insert
   */
  public insertAtStart(data: T): void {
    const newNode = new PerpetualListNode<T>(this.location, data);
    // If first node
    if (this.getHead() == null) {
      this.setHead(newNode.getAddress());
      this.increaseSize();
      return;
    }

    this.setNextNodeOf(newNode.getAddress(), this.getHead());
    this.setPreviousNodeOf(this.getHead(), newNode.getAddress());
    this.setHead(newNode.getAddress());
    this.increaseSize();
  }

  /**
   * Inserts a new element at the end of the list
   * @param {T} data Data of the element to insert
   */
  public insertAtEnd(data: T): void {
    const newNode = new PerpetualListNode<T>(this.location, data);
    /* When first node */
    if (this.getHead() == null) {
      this.setHead(newNode.getAddress());
      this.increaseSize();
      return;
    }
    const lastNodeAddress = this.elementAt(this.count());
    console.log('Last node address: ' + lastNodeAddress);
    this.setPreviousNodeOf(newNode.getAddress(), lastNodeAddress);
    this.setNextNodeOf(lastNodeAddress, newNode.getAddress());
    this.increaseSize();
  }

  /**
   * Gets the element at a given position
   * @param {number} position The position of the element
   * @returns {ListNode<T>} The element at the given position
   */
  public elementAt(position: number): Address | null {
    if (this.isEmpty()) {
      console.error('Error: List is empty');
      return null;
    }

    if (this.isInvalidPosition(position)) {
      console.error(
        `Error: Position '${position}' is out of range 1..${this.count()}`
      );
      return null;
    }

    let tmpAddress = this.getHead();
    for (let i = 1; i < position; ++i)
      tmpAddress = this.getNextElementOf(tmpAddress);
    return tmpAddress;
  }

  /**
   * Gets the address of the next element of a given node
   * @param {Address} address The address of the next element
   */
  private getNextElementOf(current: Address): Address | null {
    const objects = path.join(this.getLocation(), 'objects');
    if (!current) return null;
    const node = path.join(objects, current);
    const buff: Buffer = readFileSync(node);
    const data: Array<string> = buff.toString().split('\n');
    return data[1] === 'NULL' ? null : data[1];
  }

  /**
   * Determines if the list is empty
   * @returns {boolean}
   */
  public isEmpty(): boolean {
    return this.count() === 0;
  }

  /**
   * Gets all the elements of the list in an array
   * @returns {Array<Address>} Array of elements
   */
  public entries(): Array<Address> {
    let tmpNode: Address = this.getHead();
    let entries = new Array<Address>();
    while (tmpNode !== null) {
      entries.push(tmpNode);
      tmpNode = this.getNextElementOf(tmpNode);
    }

    return entries;
  }

  /**
   * Gets the number of elements on the list
   * @returns {number} The size
   */
  public count(): number {
    const infoData: Array<string> = this.readInformationFile();
    const size: any = infoData[2];
    if (typeof Number(size) !== 'number' || Number.isNaN(Number(size)))
      throw Error("'.list' has been corrupted");
    return Number(size);
  }

  /**
   * Increases the size of the current list
   */
  private increaseSize(): void {
    const infoLines: Array<string> = this.readInformationFile();
    let currentSize: number = Number(infoLines[2]);
    infoLines[2] = currentSize + 1 + '';
    this.writeInformationFile(infoLines);
  }

  /**
   * Determines if a givien position is no valid
   * @param {number} position Positive integer representing the position
   * @returns {boolean} A boolean determining if the given position is not valid
   */
  private isInvalidPosition(position: number): boolean {
    return position < 1 || position > this.count();
  }

  /**
   * Gets the address of the current node
   * @returns {Address} The address of the current head
   */
  private getHead(): Address {
    const headPath = path.join(this.location, 'HEAD');
    const buff: Buffer = fs.readFileSync(headPath);
    let address: Address = buff.toString();
    if (typeof address !== 'string')
      throw Error('HEAD files has been corrupted');
    address = address === 'NULL' ? null : address;
    return address;
  }

  /**
   * Writes the list's name in the .list file
   * @param {string} name The new name of the list
   */
  public setName(name: string): void {
    const info: Array<string> = this.readInformationFile();
    console.log(info);
    info[0] = name;

    this.writeInformationFile(info);
  }

  /**
   * Gets the name of the current list
   * @returns {string} The name of the list
   */
  public getName(): string {
    return this.readInformationFile()[0];
  }

  /**
   * Writes the location of the list into the .list file
   * @param {string} location The location of the list
   */
  private setLocation(location: string): void {
    const info: Array<string> = this.readInformationFile();
    info[1] = location;
    this.writeInformationFile(info);
  }

  /**
   * Reads the location of the current list
   * @returns {string} The location of the list
   */
  private getLocation(): string {
    return this.readInformationFile()[1];
  }

  /**
   * Changes the head of the list
   * @param {Address} newHead New head node
   */
  private setHead(newHead: Address): void {
    const headPath = path.join(this.location, 'HEAD');
    writeFileSync(headPath, newHead!.toString());
  }

  /**
   * Sets the previous node of the current head
   * @param {Address} prev Previous node
   /**
   * Sets the previous node of a given node
   * @param {Address} current The address of the current node
   * @param {Address} prev The address of the node to set as the previous of current node
   * @returns
   */
  private setPreviousNodeOf(current: Address, prev: Address): void {
    if (!current) return;
    const node: string = path.join(this.location, 'objects', current);
    const buff: Buffer = readFileSync(node);
    const lines: Array<Address> = buff.toString().split('\n');
    lines[0] = prev;
    let content: string = '';
    lines.forEach((l) => (content += l + '\n'));
    writeFileSync(node, content);
  }

  /**
   * Sets the next node of a node
   * @param {Address} current The address of the current node
   * @param {Address} next The address of the node to set as the next of current
   * @returns
   */
  private setNextNodeOf(current: Address, next: Address): void {
    if (!current) return;
    const curr: string = path.join(this.location, 'objects', current);
    const buff: Buffer = readFileSync(curr);
    const lines: Array<Address> = buff.toString().split('\n');
    lines[1] = next;
    let content: string = '';
    lines.forEach((l) => (content += l + '\n'));
    writeFileSync(curr, content);
  }

  /**
   * Reads the lines inside the .list file
   * @returns {Array<string>} The lines of the .list file
   */
  private readInformationFile(): Array<string> {
    const info: string = path.join(this.location, '.list');
    const buff: Buffer = fs.readFileSync(info);
    const lines: Array<string> = buff.toString().split('\n');
    const infoLines: Array<string> = new Array<string>();
    const getPureLines = (l: string) =>
      /[\s ~\w]/.test(l.trim()) && infoLines.push(l.trim());
    lines.forEach(getPureLines);
    return infoLines;
  }

  /**
   * Changes the content of the .list file
   * @param {Array<string>} changes To insert into the information file
   */
  private writeInformationFile(changes: Array<string>): void {
    const info: string = path.join(this.location, '.list');
    let cont: string = '';
    changes.forEach((change) => (cont += change + '\n'));
    writeFileSync(info, cont);
  }

  /**
   * Determines if a given path exists
   * @param {string} path
   */
  public exists(path: string): boolean {
    return fs.existsSync(path);
  }
}
