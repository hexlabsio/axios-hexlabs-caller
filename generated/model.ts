export type __ALL__ = Chicken | ChickenCollection | Schema | ChickenCreateRequest | ChickenCreateRequest2;
export type ChickenCollection = Chicken[];

export interface Chicken {
  identifier: string;
  type: string;
  name: string;
}
export interface Schema {
  [k: string]: unknown;
}
export interface ChickenCreateRequest {
  type: string;
  name: string;
}
export interface ChickenCreateRequest2 {
  type?: string;
  name?: string;
}
