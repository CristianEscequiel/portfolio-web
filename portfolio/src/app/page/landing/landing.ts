import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faChevronDown, faDownload, faLink, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { ThemeService } from '../../core/theme.service';
import { Reveal } from '../../shared/reveal';
import { ContactForm } from '../contact/contact-form';
import { EXPERIENCE, PROJECTS, TECHNOLOGIES } from './landing.data';

@Component({
  selector: 'app-landing',
  imports: [FontAwesomeModule, ContactForm, Reveal],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './landing.html',
})
export class Landing {
  protected readonly themeService = inject(ThemeService);

  readonly faGithub = faGithub;
  readonly faLinkedinIn = faLinkedinIn;
  readonly faChevronDown = faChevronDown;
  readonly faLink = faLink;
  readonly faDownload = faDownload;
  readonly faBars = faBars;
  readonly faXmark = faXmark;

  readonly menuOpen = signal(false);

  readonly email = 'esce.arguello21@gmail.com';

  readonly experience = EXPERIENCE;
  readonly projects = PROJECTS;
  readonly technologies = TECHNOLOGIES;

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  onThemeChange(event: Event): void {
    this.themeService.setDark((event.target as HTMLInputElement).checked);
  }
}
