import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUp  ,faChevronDown } from '@fortawesome/free-solid-svg-icons';
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
export class Landing {
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

}
