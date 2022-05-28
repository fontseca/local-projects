import { Hash } from '../../../common/types';
import { GenerateHash } from '../../../helpers';

export default class Character {
  private name!: string;
  private overview!: string;
  private personality!: string;
  private hash: Hash = GenerateHash();

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
