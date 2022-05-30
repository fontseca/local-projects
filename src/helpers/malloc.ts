import { Address } from '../common/types';
import { v4 } from 'uuid';

export default function Malloc(): Address {
  let add1: string = v4();
  let add2: string = v4();

  add1 = add1
    .split('')
    .map((val) => (val === '-' ? '' : val.toLowerCase()))
    .join('');

  add2 = add2
    .split('')
    .map((val) => (val === '-' ? '' : val.toLowerCase()))
    .join('');

  return add1 + add2;
}
