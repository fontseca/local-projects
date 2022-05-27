import { Identifier } from '../../common/types';
import { Tree } from '../../data-structres';

class Character {
  private name!: string;
  private overview!: string;
  private personality!: string;

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setOverview(overview: string) {
    this.overview = overview;
  }

  public getOverview(): string {
    return this.overview;
  }

  public getPersonality(): string {
    return this.personality;
  }

  public setPersonality(personality: string): void {
    this.personality = personality;
  }
}

class Novel {
  private title: string = 'Untitled';
  private characters: Array<Character> = new Array<Character>();
  private chapters: number = 0;
  private tail: Tree | null = null;

  public getTitle(): string {
    return this.title;
  }

  public setTitle(title: string): void {
    this.title = title;
  }

  public addChapter(title: string): Identifier {
    const chapter: Tree = new Tree();

    chapter.setTitle(title);

    // If first chapter
    if (this.tail === null) {
      this.tail = chapter;
      this.chapters++;
      return chapter.getIdentifier();
    }

    chapter.setParent(this.tail);
    this.tail = chapter;

    this.chapters++;

    return chapter.getIdentifier();
  }

  public addScene(
    chapterIdentifier: Identifier,
    content: string
  ): Identifier | null {
    const scene: Tree = new Tree();
    const ch: Tree | null = this.searchChapter(chapterIdentifier);

    // Chapter not found
    if (!ch) return null;

    scene.appendContent(content);
    scene.setParent(ch);
    ch.appendChild(scene);
    return scene.getIdentifier();
  }

  public searchChapter(identifier: Identifier): Tree | null {
    let ch: Tree | null = this.tail;

    while (ch !== null) {
      if (ch.getIdentifier() === identifier) break;
      ch = ch.getParent();
    }

    /* Not found */
    if (!ch) return null;

    return ch;
  }

  public getChaptersNumber(): number {
    return this.chapters;
  }

  public getCharactersNumber(): number {
    return this.characters.length;
  }
}

export default Novel;
