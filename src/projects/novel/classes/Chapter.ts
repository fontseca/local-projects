import { Hash } from '../../../common/types';
import { List } from '../../../data-structres';
import { GenerateHash } from '../../../helpers';
import Scene from './Scene';

export default class Chapter {
  private title: string = 'Untitled';
  private hash: Hash = GenerateHash();
  public scenes: List<Scene> = new List<Scene>();

  public setTitle(title: string): void {
    this.title = title;
  }

  public getTitle(): string {
    return this.title;
  }

  public getHash(): Hash {
    return this.hash;
  }
}
