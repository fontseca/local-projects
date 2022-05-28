import ListNode from './ListNode';

export default class List<T> {
  private head: ListNode<T> | null = null;
  private size: number = 0;

  /**
   * Inserts a new element at the beginning of the list
   * @param {T} data Data of the element to insert
   */
  public insertAtStart(data: T): void {
    const newNode = new ListNode<T>(data);

    // If first node
    if (this.head == null) {
      this.head = newNode;
      this.size++;
      return;
    }

    newNode.next = this.head;
    this.head.prev = newNode;
    this.head = newNode;
    this.size++;
  }

  /**
   * Inserts a new element at the end of the list
   * @param {T} data Data of the element to insert
   */
  public insertAtEnd(data: T): void {
    const newNode = new ListNode<T>(data);

    /* If first node */
    if (this.head == null) {
      this.head = newNode;
      this.size++;
      return;
    }

    const lastNode: ListNode<T> | null = this.elementAt(this.size);
    newNode.prev = lastNode;
    lastNode!.next = newNode;
    this.size++;
  }

  /**
   * Gets the element at a given position
   * @param {number} position The position of the element
   * @returns {ListNode<T>} The element at the given position
   */
  public elementAt(position: number): ListNode<T> | null {
    if (this.isEmpty()) {
      console.error('Error: List is empty');
      return this.head;
    }

    if (this.isInvalidPosition(position)) {
      console.error(
        `Error: Position '${position}' is out of range 1..${this.size}`
      );
      return this.head;
    }

    let tmpNode: ListNode<T> | null = this.head;
    for (let i = 1; i < position; ++i) tmpNode = tmpNode!.next;
    return tmpNode;
  }

  /**
   * Determines if the list is empty
   * @returns {boolean}
   */
  public isEmpty(): boolean {
    return this.size === 0;
  }

  /**
   * Gets all the elements of the list in an array
   * @returns {Array<T>} Array of elements
   */
  public entries(): Array<T> {
    let tmpNode: ListNode<T> | null = this.head;
    let entries = new Array<T>();

    /* Try to find node to insert child */
    while (tmpNode !== null) {
      entries.push(tmpNode.data);
      tmpNode = tmpNode.next;
    }

    return entries;
  }

  /**
   * Gets the number of elements on the list
   * @returns {number} The size
   */
  public count(): number {
    return this.size;
  }

  /**
   * Determines if a givien position is no valid
   * @param {number} position Positive integer representing the position
   * @returns {boolean} A boolean determining if the given position is not valid
   */
  private isInvalidPosition(position: number): boolean {
    return position < 1 || position > this.size;
  }
}
