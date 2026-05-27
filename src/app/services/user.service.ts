import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
}

/**
 * Clean User Service Implementation
 * 
 * This service follows Angular best practices:
 * - Uses HttpClient for all HTTP operations
 * - Properly typed with interfaces
 * - Injectable with providedIn: 'root' for singleton pattern
 * - Returns Observables for reactive programming
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'https://api.example.com/users';

  constructor(private http: HttpClient) {}

  /**
   * Fetch all user profiles
   * @returns Observable of UserProfile array
   */
  getUserProfiles(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(this.apiUrl);
  }

  /**
   * Fetch a single user profile by ID
   * @param userId - The user's unique identifier
   * @returns Observable of UserProfile
   */
  getUserProfile(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}`);
  }

  /**
   * Update user profile
   * @param userId - The user's unique identifier
   * @param profile - Updated profile data
   * @returns Observable of updated UserProfile
   */
  updateUserProfile(userId: number, profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/${userId}`, profile);
  }

  /**
   * Delete user profile
   * @param userId - The user's unique identifier
   * @returns Observable of void
   */
  deleteUserProfile(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
}

// Made with Bob
