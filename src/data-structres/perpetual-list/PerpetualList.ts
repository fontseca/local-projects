import fs, { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { Address } from '../../common/types';
import PerpetualListNode from './PerpetualListNode';

/**
 * Creates a list that will be stored a the given location
 */
export default class PerpetualList<T> {
  private location: string;
  private name: string;

  /**
   * Crates a new perpetual list
   * @param {string} name The name of the list
   * @param {string} location The path where the list will be stored
   */
  constructor(name: string, location: string) {
    this.name = name;
    this.location = path.join(path.resolve(location), this.name);
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
    newNode.setNext(this.getHead());
    this.setPreviousNode(newNode.getAddress());
    this.setHead(newNode.getAddress());
    this.increaseSize();
  }

  /**
   * Inserts a new element at the end of the list
   * @param {T} data Data of the element to insert
   */
  // public insertAtEnd(data: T): void {
  //   const newNode = new ListNode<T>(data);

  //   /* If first node */
  //   if (this.head == null) {
  //     this.head = newNode;
  //     this.size++;
  //     return;
  //   }

  //   const lastNode: ListNode<T> | null = this.elementAt(this.size);
  //   newNode.prev = lastNode;
  //   lastNode!.next = newNode;
  //   this.size++;
  // }

  /**
   * Gets the element at a given position
   * @param {number} position The position of the element
   * @returns {ListNode<T>} The element at the given position
   */
  // public elementAt(position: number): ListNode<T> | null {
  //   if (this.isEmpty()) {
  //     console.error('Error: List is empty');
  //     return this.head;
  //   }

  //   if (this.isInvalidPosition(position)) {
  //     console.error(
  //       `Error: Position '${position}' is out of range 1..${this.size}`
  //     );
  //     return this.head;
  //   }

  //   let tmpNode: ListNode<T> | null = this.head;
  //   for (let i = 1; i < position; ++i) tmpNode = tmpNode!.next;
  //   return tmpNode;
  // }

  /**
   * Determines if the list is empty
   * @returns {boolean}
   */
  public isEmpty(): boolean {
    return this.count() === 0;
  }

  /**
   * Gets all the elements of the list in an array
   * @returns {Array<T>} Array of elements
   */
  // public entries(): Array<T> {
  //   let tmpNode: ListNode<T> | null = this.head;
  //   let entries = new Array<T>();

  //   /* Try to find node to insert child */
  //   while (tmpNode !== null) {
  //     entries.push(tmpNode.data);
  //     // tmpNode = tmpNode.next;
  //   }

  //   return entries;
  // }

  /**
   * Gets the number of elements on the list
   * @returns {number} The size
   */
  public count(): number {
    const infoData: Array<string> = this.readInformationFile();
    const size: any = infoData[2];
    if (typeof Number(size) !== 'number' || Number.isNaN(Number(size)))
      throw Error("'.list' has been corrupted");
    return Number(infoData[1]);
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
   * Gets the data of an element depending on the given condition
   * @param callback A callback that returns the condition
   * @returns {T | undefined} The data of the element
   */
  // public where(callback: (data: T) => boolean): T | undefined {
  //   let tmpNode: ListNode<T> | null = this.head;

  //   while (tmpNode !== null) {
  //     let res: boolean = callback(tmpNode.data);
  //     if (res) break;
  //     // tmpNode = tmpNode.next;
  //   }

  //   if (!tmpNode) {
  //     console.log('Element not found');
  //     return void 0;
  //   }

  //   return tmpNode?.data;
  // }

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
   */
  private setPreviousNode(prev: Address): void {
    const headNodePath: string = path.join(
      this.location,
      'objects',
      this.getHead()!.toString()
    );
    const buff: Buffer = readFileSync(headNodePath);
    const lines: Array<Address> = buff.toString().split('\n');
    lines[0] = prev;
    let content: string = '';
    lines.forEach((l) => (content += l + '\n'));
    writeFileSync(headNodePath, content);
  }

  /**
   * Determines if a given path exists
   * @param {string} path
   */
  private exists(path: string): boolean {
    return fs.existsSync(path);
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
}
