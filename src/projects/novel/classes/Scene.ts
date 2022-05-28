import { Hash } from '../../../common/types';
import { List } from '../../../data-structres';
import { GenerateHash } from '../../../helpers';
import SceneNote from './SceneNote';
import SceneQuote from './SceneQuote';

export default class Scene {
  private title: string = 'Untitled Scene';
  public notes: List<SceneNote> = new List<SceneNote>();
  public quotes: List<SceneQuote> = new List<SceneQuote>();
  private content: string = '';
  private hash: Hash = GenerateHash();

  public setTitle(title: string): void {
    this.title = title;
  }

  public getTitle(): string {
    return this.title;
  }

  public getHash(): Hash {
    return this.hash;
  }

  public appendContent(content: string): void {
    this.content += content;
  }

  public getContent(): string {
    return this.content;
  }
}
