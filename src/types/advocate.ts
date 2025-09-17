export interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  createdAt?: Date;
}

export interface AdvocateCreateInput {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
}

export interface AdvocateApiResponse {
  data: Advocate[];
  warning?: string;
}

export interface AdvocateSearchFilters {
  searchTerm?: string;
  city?: string;
  degree?: string;
  specialties?: string[];
  minExperience?: number;
  maxExperience?: number;
}