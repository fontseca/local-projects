import { Hash } from '../common/types';
import { v4 } from 'uuid';

export default function GenerateHash(): Hash {
  let hash: string = v4();
  hash = hash
    .split('')
    .map((val) => (val === '-' ? '' : val.toUpperCase()))
    .join('');
  return hash;
}
