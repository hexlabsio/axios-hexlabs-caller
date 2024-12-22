export type __ALL__ = Access | AccountType | User | AccountAccess | AccountClaims;
export type Access = "admin" | "write" | "read" | "none";
export type AccountType = "user" | "org" | "ent";

export interface User {
  email: string;
}
export interface AccountAccess {
  id: string;
  type: AccountType;
  access: Access;
}
export interface AccountClaims {
  userAccount: AccountAccess;
  otherAccounts: AccountAccess[];
}
