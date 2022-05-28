import { Hash } from '../../common/types';
import { List } from '../../data-structres';
import { Chapter, Character } from './classes';
import Scene from './classes/Scene';

export default class Novel {
  private title: string = 'Untitled';
  private characters: Array<Character> = new Array<Character>();
  private chapters: List<Chapter> = new List<Chapter>();

  /**
   * Adds a new chapters to the list
   * @param {string} title The title of the chapter to add
   * @returns {Hash} The unique Hashs of the chapter
   */
  public addChapter(title: string): Hash {
    const ch: Chapter = new Chapter();
    ch.setTitle(title);
    this.chapters.insertAtEnd(ch);
    return ch.getHash();
  }

  /**
   * Adds a new scene to a given chapter
   * @param {Hash} hash The hash of the chapter to insert the new sece
   * @param {string} content The content of the new scene
   * @returns {Hash} The hash of the created scene
   */
  public addScene(hash: Hash, content: string): Hash {
    if (!this.chapters.count())
      throw 'Error: This novel does not have chapters';

    const sc: Scene = new Scene();

    /* Get the chapter by its hash */
    const ch = this.chapters.where((c) => c.getHash() === hash);

    sc.appendContent(content);
    ch?.scenes.insertAtEnd(sc);

    return sc.getHash();
  }

  /**
   * Gets an array of all chapters of the novel
   * @returns {Array<Chapter>} The chapters
   */
  public chapterEntries(): Array<Chapter> {
    return this.chapters.entries();
  }

  /**
   * Gets the title of the novel
   * @returns {string}
   */
  public getTitle(): string {
    return this.title;
  }

  /**
   * Updates the title of the novel
   * @param title New title
   */
  public setTitle(title: string): void {
    this.title = title;
  }
}
