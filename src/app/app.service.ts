import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://api.example.com/categories'; // Buraya API URL'nizi koyun

  private sampleDataArr = [
    { "category": "Elektronik", "count": 10 },
    { "category": "Mobilya", "count": 7 },
    { "category": "Kırtasiye", "count": 12 },
    { "category": "Giyim", "count": 5 }
  ]
  
  /*getCategoryData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
    */
   getCategoryData(): Observable<any[]> {
    return of(this.sampleDataArr);
   }
  
}
