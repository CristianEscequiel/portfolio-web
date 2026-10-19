import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { Landing } from "./page/landing/landing";

@Component({
  selector: 'app-root',
  imports: [Landing],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('portfolio');
}
