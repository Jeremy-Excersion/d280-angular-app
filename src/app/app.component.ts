import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  selectedCountry: string = '';
  title = 'angular-app';
  onCountryMouseOver(country: string) {
    // Set the selected country when mouseover event occurs
    this.selectedCountry = country;
    console.log('Country Mouse Over:', country);
  }
}
