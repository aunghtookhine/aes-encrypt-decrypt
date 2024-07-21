export type BITS = "128" | "192" | "256";
export type CRYPTOGRAPHY = "Encrypt" | "Decrypt";

export interface Record {
  fileData: string;
  cryptography: CRYPTOGRAPHY;
  keyLength: string;
  durationsInSec: number;
}
