import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://api.example.com/categories'; // Buraya API URL'nizi koyun

  private sampleDataArr = [
    { "itemCode": "DON-TRE-TSE", "totalQty": 10, "companies": [{ "cardName": "Aselsam", "plannedQty": 10 }] },
    { "itemCode": "DON-TRE-TSE", "totalQty": 10, "companies": [{ "cardName": "Aselsam", "plannedQty": 20 }] },
    { "itemCode": "DON-TRE-TSE", "totalQty": 10, "companies": [{ "cardName": "Aselsam", "plannedQty": 30 }] },
    { "itemCode": "DON-TRE-TSE", "totalQty": 10, "companies": [{ "cardName": "Aselsam", "plannedQty": 40 }] }
  ]

  /*getCategoryData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
    */
  getCategoryData(): Observable<any[]> {
    return of(this.sampleDataArr);
  }

}
