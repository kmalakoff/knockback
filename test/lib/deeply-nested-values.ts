export function deeplyNestedEqualValues(depth = 5000): [unknown, unknown] {
  let first: unknown = 'leaf';
  let second: unknown = 'leaf';

  for (let index = 0; index < depth; index++) {
    first = { value: first };
    second = { value: second };
  }

  return [first, second];
}
