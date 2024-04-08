import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { from } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CountryApiService {
    private baseUrl = 'http://api.geonames.org/countryInfoJSON';
    private username = 'jconkl4';

    getCountryInfo(countryName: string): Observable<any> {
        const url = `${this.baseUrl}?country=${countryName}&username=${this.username}`;
        return from(fetch(url).then((response) => response.json()));
    }
}
