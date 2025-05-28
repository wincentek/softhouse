// Shared types between frontend and backend

export interface Person {
  firstname: string;
  lastname: string;
  addresses: Address[];
  phones: Phone[];
  family: FamilyMember[];
}

export interface Address {
  street: string;
  city: string;
  zip: string;
}

export interface Phone {
  mobile: string;
  landline: string;
}

export interface FamilyMember {
  name: string;
  born: string;
  addresses: Address[];
  phones: Phone[];
}

export interface ParsedData {
  people: Person[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TextServiceResponse {
  textData: string;
}

// Line types for parsing
export type LineType = 'P' | 'T' | 'A' | 'F';

export interface ParsedLine {
  type: LineType;
  data: string[];
}