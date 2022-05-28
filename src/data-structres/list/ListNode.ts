export default class ListNode<T> {
  public next: ListNode<T> | null = null;
  public prev: ListNode<T> | null = null;
  public data: T;

  constructor(data: T) {
    this.data = data;
  }
}
