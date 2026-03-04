import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUp  ,faChevronDown , faLink , faDownload} from '@fortawesome/free-solid-svg-icons';
import {
        faGithub , faLinkedinIn,
        faJs ,faHtml5 ,
        faCss3 , faAngular ,
        faPostgresql ,
        faNodeJs, faPython ,
        faTailwindCss
        } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-landing',
  standalone:true,
  imports: [FontAwesomeModule],
  templateUrl: './landing.html',
})
export class Landing implements OnInit , AfterViewInit {
  faArrowUp = faArrowUp;
  faGithub = faGithub;
  faLinkedinIn = faLinkedinIn;
  faJs = faJs ;
  faHtml5 = faHtml5 ;
  faCss = faCss3;
  faAngular = faAngular ;
  faPostgresql = faPostgresql;
  faNodeJs = faNodeJs;
  faPython = faPython;
  faTailwindCss = faTailwindCss
  faChevronDown = faChevronDown
  faLink = faLink
  faDownload = faDownload

  theme: string = 'business'

 ngOnInit() {
  const saved = localStorage.getItem('theme');
  if (saved === 'corporate' || saved === 'business') {
    this.theme = saved;
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.theme = prefersDark ? 'business' : 'corporate';
  }
  this.applyTheme(this.theme);
}

toggleTheme(ev: Event) {
  const checked = (ev.target as HTMLInputElement).checked;
  this.theme = checked ? 'business' : 'corporate';
  localStorage.setItem('theme', this.theme);
  this.applyTheme(this.theme);
}

private applyTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', theme);
}

ngAfterViewInit() {
  const items = document.querySelectorAll('.reveal');

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });

  items.forEach(el => io.observe(el));
}

}
