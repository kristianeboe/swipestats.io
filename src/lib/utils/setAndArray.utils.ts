// Union of two sets
export function union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA, ...setB]);
}

// Intersection of two sets
export function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA].filter((element) => setB.has(element)));
}

// Difference of two sets (elements in setA not in setB)
export function difference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set([...setA].filter((element) => !setB.has(element)));
}

// Symmetric difference of two sets (elements in either setA or setB but not both)
export function symmetricDifference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  return new Set(
    [...setA]
      .filter((x) => !setB.has(x))
      .concat([...setB].filter((x) => !setA.has(x))),
  );
}

// Checks if setA is a subset of setB
export function isSubset<T>(setA: Set<T>, setB: Set<T>): boolean {
  return [...setA].every((element) => setB.has(element));
}

export function uniqueByKeyInArray<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const keyValue = item[key];
    if (!seen.has(keyValue)) {
      seen.add(keyValue);
      return true;
    }
    return false;
  });
}

export function partitionArray<T>(
  array: T[],
  predicate: (item: T) => boolean,
): [T[], T[]] {
  return array.reduce<[T[], T[]]>(
    ([pass, fail], item) => {
      return predicate(item)
        ? [[...pass, item], fail]
        : [pass, [...fail, item]];
    },
    [[], []],
  );
}

export function chunk<T>(array: T[], size: number): T[][] {
  return array.reduce(
    (acc, _, i) => (i % size ? acc : [...acc, array.slice(i, i + size)]),
    [] as T[][],
  );
}

export function bifurcate<T>(array: T[], filter: boolean[]): [T[], T[]] {
  return array.reduce<[T[], T[]]>(
    (acc, val, i) => (acc[filter[i] ? 0 : 1].push(val), acc),
    [[], []],
  );
}

export function removeFromArray<T>(
  array: T[],
  predicate: (item: T) => boolean,
): T[] {
  return array.filter((item) => !predicate(item));
}
