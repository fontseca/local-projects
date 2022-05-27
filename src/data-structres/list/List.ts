import { v4 } from 'uuid';
import { Identifier } from '../../common/types';

class ListNode<T> {
  public identifier: Identifier = v4();
  public next: ListNode<T> | null = null;
  public prev: ListNode<T> | null = null;
  public children: Array<T> | null = null;
}

class List<T> {
  private tail: ListNode<T> | null = null;

  public insertNode(): Identifier {
    const newNode: ListNode<T> = new ListNode<T>();

    /* If first node */
    if (this.tail === null) {
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }

    return newNode.identifier;
  }

  public insertChildIntoNode(identifier: Identifier, child: T): void | null {
    let tmpNode: ListNode<T> | null = this.tail;
    let nodeDoInsertChil: ListNode<T> | null = null;

    /* Try to find node to insert child */
    while (tmpNode! !== null) {
      if (tmpNode?.identifier === identifier) {
        nodeDoInsertChil = tmpNode;
        break;
      }
      tmpNode = tmpNode!.prev;
    }

    /* Node not found */
    if (!nodeDoInsertChil) return null;

    /* If first node */
    if (nodeDoInsertChil.children === null) {
      nodeDoInsertChil.children = Array<T>();
    }

    nodeDoInsertChil.children.push(child);
  }

  public getEntries(): void {
    let tmpNode: ListNode<T> | null = this.tail;
    /* Try to find node to insert child */
    while (tmpNode !== null) {
      console.log(tmpNode);
      tmpNode = tmpNode!.prev;
    }
  }
}

export default List;
