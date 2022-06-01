import { Hash } from '../../common/types';
import { PerpetualList } from '../../data-structres';
import { Chapter, Character } from './classes';
import Scene from './classes/Scene';
import path from 'path';
import fs from 'fs';
import Perpetual from '../../data-structres/abstract/Perpetual';

/**
 * Interface to represent
 * the configuration object
 * when creating a new novel
 */
interface INovelConfig {
  title: string;
  path: string;
}

export default class Novel extends Perpetual {
  private title: string = 'Untitled';
  private characters: Array<Character> = new Array<Character>();
  private chapters: PerpetualList<Chapter>;
  private path: string;

  /**
   * Opens a existing novel or creates it if it does not exist
   * @param {INovelConfig} config Configuration object for the novel
   */
  constructor(config: INovelConfig) {
    super();
    this.path = path.resolve(path.join(config.path, config.title));
    const infoFilePath = path.join(this.path, '.novel');

    // If the novel does not exist in the given path, then create it
    if (!this.exists(this.path)) fs.mkdirSync(this.path);

    // If novel info file does not exist, create it
    if (!this.exists(infoFilePath))
      fs.writeFileSync(infoFilePath, `${config.title}\n${this.path}`);

    this.title = this.getTitle();

    // Create the list of chapters inside of novel dir
    this.chapters = new PerpetualList('chapters', this.path);
  }

  /**
   * Adds a new chapters to the list
   * @param {string} title The title of the chapter to add
   * @returns {Hash} The unique Hashs of the chapter
   */
  public addChapter(title: string): Hash {
    const ch: Chapter = new Chapter();
    ch.setTitle(title);
    this.chapters.insertAtEnd(ch);
    console.log(this.chapters.entries());

    return ch.getHash();
  }

  /**
   * Adds a new scene to a given chapter
   * @param {Hash} hash The hash of the chapter to insert the new sece
   * @param {string} content The content of the new scene
   * @returns {Hash} The hash of the created scene
   */
  // public addScene(hash: Hash, content: string): Hash {
  //   if (!this.chapters.count())
  //     throw 'Error: This novel does not have chapters';

  //   const sc: Scene = new Scene();

  //   /* Get the chapter by its hash */
  //   // const ch = this.chapters.where((c) => c.getHash() === hash);

  //   sc.appendContent(content);
  //   // ch?.scenes.insertAtEnd(sc);

  //   return sc.getHash();
  // }

  /**
   * Gets an array of all chapters of the novel
   * @returns {Array<Chapter>} The chapters
   */
  // public chapterEntries(): Array<Chapter> {
  // return this.chapters.entries();
  // }

  /**
   * Gets the title of the novel
   * @returns {string}
   */
  public getTitle(): string {
    const filePath: string = path.join(this.path, '.novel');
    if (!this.exists(filePath))
      throw Error(`File '.novel' does not exist inside`);
    const data: Buffer = fs.readFileSync(filePath);
    const lines: Array<string> = data.toString().split('\n');
    const pureLines: Array<string> = new Array<string>();
    const getPureLines = (l: string) =>
      /[\s]/.test(l.trim()) && pureLines.push(l.trim());
    // Select only lines that contain info about the novel
    lines.forEach(getPureLines);
    return pureLines[0];
  }

  /**
   * Updates the title of the novel
   * @param title New title
   */
  public setTitle(title: string): void {
    this.title = title;
  }
}
