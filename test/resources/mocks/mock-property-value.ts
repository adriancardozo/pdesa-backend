export function mockPropertyValue<T>(object: T, property: keyof T, value: any) {
  object[property] = value;
}
