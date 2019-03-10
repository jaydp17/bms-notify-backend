import { inspect } from 'util';
import { isProd } from './environment';

export function prettyPrint(obj: {}): void {
  if (!isProd) console.log(inspect(obj, false, 20, true));
  console.log(obj);
}
