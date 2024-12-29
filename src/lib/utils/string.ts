export function toTitleCase<T extends string>(str: T): Capitalize<T> {
  return (str.charAt(0).toUpperCase() +
    str.slice(1).toLowerCase()) as Capitalize<T>;
}
