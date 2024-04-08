import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CountryApiService } from './country-api.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    constructor(private renderer: Renderer2, private elementRef: ElementRef, private countryApiService: CountryApiService) { }
    countryInfo: any;

    ngOnInit(): void {
        this.addMouseOverListeners();
    }

    countryId = '';
    countryName = '';
    countryCapital = '';
    countryRegion = '';
    countryIncomeLevel = '';
    population = '';
    area = '';

    searchCountry(event: Event) {
        event.preventDefault();
        const countryNameInput = (document.querySelector('input[name="countryName"]') as HTMLInputElement).value;
        if (countryNameInput.trim() !== '') {
            const convertedId = this.convertCountryNameToId(countryNameInput);
            this.onCountryMouseOver(convertedId);
            this.highlightPathByCountryName(convertedId);
        }
    }

    convertCountryNameToId(countryName: string): string {
        const svgElement = this.elementRef.nativeElement.querySelector('#world-map');
        let convertedId = '';
        if (svgElement) {
            const paths = svgElement.querySelectorAll('path');
            for (let i = 0; i < paths.length; i++) {
                const path = paths[i] as HTMLElement;
                const mappedName = path.getAttribute('title');
                if (mappedName && mappedName.toLowerCase() === countryName.toLowerCase()) {
                    convertedId = path.getAttribute('id') || '';
                    break;
                }
            }
        }
        return convertedId;
    }

    addMouseOverListeners() {
        const svgElement = this.elementRef.nativeElement.querySelector('#world-map');
        if (svgElement) {
            const paths = svgElement.querySelectorAll('path');
            paths.forEach((path: HTMLElement) => {
                this.renderer.listen(path, 'mouseover', () => {
                    path.classList.add('highlighted');
                    const id = path.getAttribute('id');
                    if (id) {
                        this.onCountryMouseOver(id);
                    }
                });
                this.renderer.listen(path, 'mouseleave', () => {
                    path.classList.remove('highlighted');
                });
            });
        }
    }

    highlightPathByCountryName(countryName: string) {
        const svgElement = this.elementRef.nativeElement.querySelector('#world-map');
        if (svgElement) {
            const paths = svgElement.querySelectorAll('path');
            paths.forEach((path: HTMLElement) => {
                const id = path.getAttribute('id');
                console.log('id:', id, 'countryName:', countryName)
                if (id?.toLowerCase() === countryName.toLowerCase()) {
                    path.classList.add('highlighted');
                } else {
                    path.classList.remove('highlighted');
                }
            });
        }
    }

    onCountryMouseOver(countryName: string) {
        this.countryApiService.getCountryInfo(countryName).subscribe(
            (data: any) => {
                console.log('Country info:', data)
                if (data.geonames.length === 0) {
                    console.error('Country not found:', countryName);
                    return;
                }
                this.countryId = data.geonames[0].countryCode;
                this.countryName = data.geonames[0].countryName;
                this.countryCapital = data.geonames[0].capital;
                this.countryRegion = data.geonames[0].continentName;
                this.countryIncomeLevel = data.geonames[0].currencyCode;
                this.population = data.geonames[0].population;
                this.area = data.geonames[0].areaInSqKm;
            },
            (error: any) => {
                console.error('Error fetching country info:', error);
            }
        );
    }

}
