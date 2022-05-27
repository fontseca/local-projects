import { v4 } from 'uuid';
import { Identifier } from '../../common/types';

class Tree {
  private parent: Tree | null = null;
  private children: Array<Tree> = new Array<Tree>();

  private identifier: Identifier = v4();
  private title: string = 'Untitled';
  private content: string = '';

  public getTitle(): string {
    return this.title;
  }

  public setTitle(title: string): void {
    this.title = title;
  }

  public getIdentifier(): string {
    return this.identifier;
  }

  public setParent(parent: Tree): void {
    this.parent = parent;
  }

  public getParent(): Tree | null {
    return this.parent;
  }

  public appendContent(content: string): void {
    this.content += content;
  }

  public appendChild(child: Tree): void {
    this.children.push(child);
  }

  public getContent(): string {
    return this.content;
  }
}

export default Tree;
