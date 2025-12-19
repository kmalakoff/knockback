import type { KBMetadata } from '../types.ts';
interface KBObject {
  __kb?: KBMetadata | null;
}
export default function wrappedDestroy(obj: KBObject): void;
