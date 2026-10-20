import { provideHttpClient, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../../core/api-base-url.token';

import { Landing } from './landing';

const text = (el: Element | null | undefined): string =>
  (el?.textContent ?? '').replace(/\s+/g, ' ').trim();

// Baseline: landing.html en HEAD (3aa0229) más la tarjeta del CMMS.
const EXPERIENCE = [
  {
    company: null,
    team: null,
    roles: [
      {
        period: 'Sep 2025 – Actualidad',
        title: 'Desarrollo independiente · Proyectos propios',
        paragraphs: [
          'Diseño, desarrollo y despliego mis propios productos de punta a punta: catálogos tipo e-commerce, APIs REST, autenticación y el CMMS con backend en Spring Boot. Trabajo con CI/CD en GitHub Actions y despliegue con Docker en mi propio servidor.',
        ],
        tags: ['Angular', 'NestJS', 'Spring Boot', 'PostgreSQL', 'Docker', 'React'],
      },
    ],
  },
  {
    company: 'Pirelli Argentina',
    team: 'Ingeniería y Eficiencia de Procesos',
    roles: [
      {
        period: 'Nov 2024 – Sep 2025',
        title: 'Software Developer',
        paragraphs: [
          'Desarrollé aplicaciones de monitoreo y reportes con foco en KPIs operativos, visibilidad en tiempo real y análisis de datos productivos.',
          'Creé reportes automáticos en Python para el seguimiento de KPIs de mantenimiento: detectaba la repetitividad de fallas, las peores máquinas y la producción, para mejorar la toma de decisiones en la planificación del mantenimiento preventivo y correctivo de un área específica.',
        ],
        tags: ['Python', 'Pandas', 'SQL', 'KPIs', 'Monitoreo'],
      },
      {
        period: 'Mar 2023 – Nov 2024',
        title: 'Full Stack Developer',
        paragraphs: [
          'Construí aplicaciones internas con Angular, dashboards conectados a SQL y automatizaciones con Python para optimizar procesos.',
          'Resolví el stock online de un material de otra área, que hasta entonces se contaba a mano al final de cada turno. Crucé los registros de producción con el consumo en tiempo real para estimar el stock real, hice el análisis y la limpieza de los datos y la interfaz donde se consulta. Liberé a un operario de una hora de inventario por turno para otras tareas de cierre.',
          'Construí la interfaz para visualizar los checklists de seguridad que se hacían al inicio de cada turno en cada máquina: existía el sistema para cargarlos, pero no para verlos. Dejó a la vista que se omitían chequeos, y sumé un aviso por mail a una lista de destinatarios cuando un paso quedaba como no conforme, para poder corregirlo.',
        ],
        tags: ['Angular', 'TypeScript', 'PostgreSQL', 'Python', 'Dashboards'],
      },
      {
        period: 'Ago 2022 – Mar 2023',
        title: 'Frontend Developer',
        paragraphs: [
          'Desarrollé interfaces en Angular para proyectos internos de digitalización, mejorando flujos y experiencia de usuario.',
          'Participé en el relanzamiento de la aplicación de stock online de un sector de la planta, migrándola de AngularJS a Angular 12. Mostraba el stock en tiempo real junto con el estado de las máquinas, lo que permitía ver el sector de forma macro y asignar los recursos con más precisión.',
        ],
        tags: ['Angular', 'TypeScript', 'UI/UX', 'Digitalización'],
      },
    ],
  },
];

const ABOUT_FIRST_PARAGRAPH =
  'Hola, soy Escequiel. Desarrollador con experiencia en entornos industriales, dentro del equipo de Ingeniería y Eficiencia de Procesos, donde aprendí a trabajar con métricas, eficiencia y validación constante de datos. Aprendí que una solución no solo tiene que ser útil: tiene que aportar un valor que se pueda medir.';

const PROJECTS = [
  {
    title: 'CMMS · Gestión de órdenes de mantenimiento',
    image: 'cmms.jpg',
    description:
      'Solución para la gestión integral de órdenes de mantenimiento, en evolución continua. Frontend en Angular con autenticación JWT, roles (administrador, team leader, técnico y producción), maestro de máquinas con árbol de partes, y flujo de tomar, cerrar y liberar órdenes. Backend propio en Spring Boot con PostgreSQL, donde el servidor es la autoridad de roles y transiciones de estado. Desarrollado con spec-driven development, dejando registro de cada decisión técnica.',
    tags: ['Angular', 'TypeScript', 'Signals', 'Spring Boot', 'PostgreSQL', 'JWT', 'Docker'],
    status: 'En desarrollo',
    links: [
      'https://lab.esceweb.com/dashboard',
      'https://github.com/CristianEscequiel/angular-enterprise-lab',
      'https://github.com/CristianEscequiel/angular-enterprise-lab-api',
    ],
    linkLabels: ['Ver demo', 'GitHub · Frontend', 'GitHub · API'],
  },
  {
    title: 'Catálogo Online Fullstack',
    image: 'catalogo-fullstack.jpg',
    description:
      'Plataforma fullstack en producción para gestión y visualización de productos, con autenticación, carrito de compras y panel administrativo. Arquitectura desacoplada desarrollada con Angular y NestJS, persistencia en PostgreSQL y despliegue dockerizado con dominio propio.',
    tags: ['Angular', 'TailwindCSS', 'DaisyUI', 'NestJS', 'PostgreSQL', 'Docker'],
    status: 'En producción',
    links: [
      'https://catalog.esceweb.com/home',
      'https://github.com/CristianEscequiel/mi-catalogo-online/',
    ],
    linkLabels: ['Ver demo', 'GitHub'],
  },
  {
    title: 'Landing + Catálogo Estático',
    image: 'landing-react.jpg',
    description:
      'Solución frontend orientada a catálogos comerciales, desarrollada con React, TypeScript y Vite. Diseño reutilizable con configuración dinámica de contenido y temas, optimizada para rendimiento, escalabilidad visual y experiencia responsive.',
    tags: ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'React Router'],
    status: 'En producción',
    links: [
      'https://landing.esceweb.com',
      'https://github.com/CristianEscequiel/catalog-react',
    ],
    linkLabels: ['Ver demo', 'GitHub'],
  },
];

const TECHNOLOGIES = [
  'HTML',
  'JavaScript',
  'CSS',
  'Tailwind',
  'Angular',
  'PostgreSQL',
  'NodeJS',
  'Python',
];

describe('Landing', () => {
  let component: Landing;
  let fixture: ComponentFixture<Landing>;
  let root: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Landing],
      providers: [
        provideHttpClient(withXhr()),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'http://localhost:3000' },
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Landing);
    component = fixture.componentInstance;
    fixture.detectChanges();
    root = fixture.nativeElement as HTMLElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('estructura y navegación', () => {
    it('REQ-7: la sección de proyectos tiene id="projects"', () => {
      expect(root.querySelector('section#projects')).not.toBeNull();
    });

    it('REQ-8: el nav muestra Proyectos entre Experiencia y Contacto', () => {
      const hrefs = Array.from(root.querySelectorAll('nav[aria-label="Principal"] a[href^="#"]')).map((a) =>
        a.getAttribute('href'),
      );
      expect(hrefs).toEqual(['#hero', '#about', '#experience', '#projects', '#contact']);
      const labels = Array.from(root.querySelectorAll('nav[aria-label="Principal"] a[href^="#"]')).map((a) => text(a));
      expect(labels[3]).toBe('Proyectos');
    });

    it('REQ-9: el footer muestra Proyectos con href #projects', () => {
      const link = Array.from(root.querySelectorAll('footer a')).find(
        (a) => text(a) === 'Proyectos',
      );
      expect(link?.getAttribute('href')).toBe('#projects');
    });

    it('REQ-10: los hrefs del footer no tienen espacio inicial', () => {
      const hrefs = Array.from(root.querySelectorAll('footer a')).map((a) =>
        a.getAttribute('href'),
      );
      expect(hrefs).toEqual(['#hero', '#about', '#experience', '#projects', '#contact']);
    });

    it('REQ-11: Tecnologías va antes de Contacto', () => {
      const ids = Array.from(root.querySelectorAll('section[id]')).map((s) => s.id);
      expect(ids.indexOf('stack')).toBeGreaterThan(-1);
      expect(ids.indexOf('stack')).toBeLessThan(ids.indexOf('contact'));
    });
  });

  describe('sobre mí', () => {
    it('REQ-21: muestra el primer párrafo reescrito y conserva los otros dos', () => {
      const paragraphs = Array.from(root.querySelectorAll('#about p')).map((p) => text(p));
      expect(paragraphs.length).toBe(3);
      expect(paragraphs[0]).toBe(ABOUT_FIRST_PARAGRAPH);
      expect(paragraphs[1]).toContain('Hoy me desempeño como Full Stack Developer');
      expect(paragraphs[2]).toContain('Desarrollo aplicaciones web pensadas para evolucionar');
    });
  });

  describe('experiencia', () => {
    const entries = () => Array.from(root.querySelectorAll('#experience ul.timeline > li'));

    it('REQ-17: muestra 2 entradas, la independiente a la izquierda y Pirelli a la derecha', () => {
      expect(entries().length).toBe(2);
      expect(entries()[0].querySelector('.timeline-start')).not.toBeNull();
      expect(entries()[1].querySelector('.timeline-end')).not.toBeNull();
    });

    it('REQ-18: Pirelli muestra empresa y equipo', () => {
      EXPERIENCE.forEach((expected, i) => {
        const entry = entries()[i];
        const company = entry.querySelector('.company');
        const team = entry.querySelector('.team');
        expect(company ? text(company) : null).toBe(expected.company);
        expect(team ? text(team) : null).toBe(expected.team);
      });
    });

    it('REQ-19: Pirelli lista Software Developer, Full Stack y Frontend en ese orden', () => {
      const titles = Array.from(entries()[1].querySelectorAll('.role .font-black')).map((t) =>
        text(t),
      );
      expect(titles).toEqual(['Software Developer', 'Full Stack Developer', 'Frontend Developer']);
    });

    it('REQ-20: cada puesto conserva período, título, párrafos y etiquetas', () => {
      EXPERIENCE.forEach((expectedEntry, i) => {
        const roles = Array.from(entries()[i].querySelectorAll('.role'));
        expect(roles.length).toBe(expectedEntry.roles.length);
        roles.forEach((role, j) => {
          const expected = expectedEntry.roles[j];
          expect(text(role.querySelector('time'))).toBe(expected.period);
          expect(text(role.querySelector('.font-black'))).toBe(expected.title);
          expect(Array.from(role.querySelectorAll('p')).map((p) => text(p))).toEqual(
            expected.paragraphs,
          );
          expect(Array.from(role.querySelectorAll('.badge')).map((b) => text(b))).toEqual(
            expected.tags,
          );
        });
      });
    });
  });

  describe('proyectos', () => {
    const cards = () => Array.from(root.querySelectorAll('#projects article'));

    it('REQ-13: muestra 3 proyectos con el CMMS primero', () => {
      expect(cards().length).toBe(3);
      expect(text(cards()[0].querySelector('h3'))).toBe(PROJECTS[0].title);
    });

    it('REQ-15: conserva título, imagen, descripción y etiquetas', () => {
      cards().forEach((card, i) => {
        const expected = PROJECTS[i];
        expect(text(card.querySelector('h3'))).toBe(expected.title);
        expect(card.querySelector('figure img')?.getAttribute('src') ?? null).toBe(expected.image);
        expect(text(card.querySelector('p'))).toBe(expected.description);
        expect(Array.from(card.querySelectorAll('.badge-outline')).map((b) => text(b))).toEqual(
          expected.tags,
        );
      });
    });

    it('REQ-16: conserva estado y enlaces', () => {
      cards().forEach((card, i) => {
        const expected = PROJECTS[i];
        expect(text(card.querySelector('.badge-ghost'))).toBe(expected.status);
        const links = Array.from(card.querySelectorAll('a[href]'));
        expect(links.map((a) => a.getAttribute('href'))).toEqual(expected.links);
        expect(links.map((a) => text(a))).toEqual(expected.linkLabels);
        links.forEach((a) => expect(a.getAttribute('rel')).toBe('noopener noreferrer'));
      });
    });
  });

  describe('cmms: imagen, demo y grilla', () => {
    const cmms = () => root.querySelector('#projects article') as HTMLElement;

    it('REQ-C1: la tarjeta del CMMS muestra cmms.jpg con alt descriptivo y carga diferida', () => {
      const img = cmms().querySelector('figure img');
      expect(img?.getAttribute('src')).toBe('cmms.jpg');
      expect(img?.getAttribute('alt')).toContain('CMMS');
      expect(img?.getAttribute('loading')).toBe('lazy');
    });

    it('REQ-C2: Ver demo del CMMS apunta al lab, seguro y antes de los enlaces de GitHub', () => {
      const links = Array.from(cmms().querySelectorAll('a[href]'));
      expect(text(links[0])).toBe('Ver demo');
      expect(links[0].getAttribute('href')).toBe('https://lab.esceweb.com/dashboard');
      expect(links[0].getAttribute('rel')).toBe('noopener noreferrer');
      expect(links[0].getAttribute('target')).toBe('_blank');
    });

    it('REQ-C3: en pantalla grande la grilla tiene 3 columnas y ninguna tarjeta ocupa todo el ancho', () => {
      const grid = root.querySelector('#projects .grid') as HTMLElement;
      expect(grid.classList).toContain('lg:grid-cols-3');
      expect(cmms().classList).toContain('lg:col-span-1');
    });

    it('REQ-C4: en pantalla mediana la grilla conserva 2 columnas con el CMMS a todo el ancho', () => {
      const grid = root.querySelector('#projects .grid') as HTMLElement;
      expect(grid.classList).toContain('md:grid-cols-2');
      expect(cmms().classList).toContain('md:col-span-2');
    });
  });

  describe('tecnologías', () => {
    it('REQ-14: muestra 8 tecnologías en el orden de la baseline', () => {
      const names = Array.from(root.querySelectorAll('#stack .group span')).map((s) => text(s));
      expect(names).toEqual(TECHNOLOGIES);
    });
  });

  describe('accesibilidad', () => {
    it('REQ-A1: no hay ids repetidos', () => {
      const ids = Array.from(root.querySelectorAll('[id]')).map((el) => el.id);
      expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    });

    it('REQ-A2: los enlaces de LinkedIn y GitHub tienen nombre accesible', () => {
      const linkedin = root.querySelector('#hero a[href*="linkedin.com"]');
      const github = root.querySelector('#hero a[href="https://github.com/CristianEscequiel/"]');
      expect(linkedin?.getAttribute('aria-label')).toBe('LinkedIn');
      expect(github?.getAttribute('aria-label')).toBe('GitHub');
    });

    it('REQ-A3: el botón de bajar es un único enlace a #about con nombre', () => {
      const links = root.querySelectorAll('#hero a[href="#about"]');
      expect(links.length).toBe(1);
      expect(links[0].getAttribute('aria-label')).toBe('Ir a Sobre mí');
      expect(links[0].classList).toContain('btn');
    });

    it('REQ-A4: hay un único main con las secciones y sin el footer', () => {
      const mains = root.querySelectorAll('main');
      expect(mains.length).toBe(1);
      const main = mains[0];
      expect(main.id).toBe('main');
      ['hero', 'about', 'experience', 'projects', 'stack', 'contact'].forEach((id) =>
        expect(main.querySelector(`section#${id}`)).withContext(id).not.toBeNull(),
      );
      expect(main.querySelector('footer')).toBeNull();
    });

    it('REQ-A5: el primer elemento enfocable es el enlace para saltar al contenido', () => {
      const first = root.querySelector('a[href], button, input, select, textarea');
      expect(first?.getAttribute('href')).toBe('#main');
      expect(text(first)).toBe('Saltar al contenido');
    });

    it('REQ-A6: las navegaciones tienen nombre', () => {
      expect(root.querySelector('nav[aria-label="Principal"]')).not.toBeNull();
      expect(root.querySelector('footer nav[aria-label="Pie de página"]')).not.toBeNull();
    });

    it('REQ-A7: la foto de perfil tiene texto alternativo descriptivo', () => {
      expect(root.querySelector('#hero img')?.getAttribute('alt')).toBe(
        'Foto de perfil de Escequiel Argüello',
      );
    });

    it('REQ-A8: los SVG decorativos están ocultos para lectores de pantalla', () => {
      const svgs = Array.from(root.querySelectorAll('nav svg, #experience svg'));
      expect(svgs.length).toBeGreaterThan(0);
      svgs.forEach((svg) => expect(svg.getAttribute('aria-hidden')).toBe('true'));
    });

    it('REQ-A9: el selector de tema muestra contorno al enfocarse', () => {
      const label = root.querySelector('nav label.swap');
      expect(label?.classList).toContain('focus-within:outline-2');
    });

    it('REQ-A10: el rebote del botón de bajar solo aplica con movimiento permitido', () => {
      const button = root.querySelector('#hero a[href="#about"]');
      expect(button?.classList).toContain('motion-safe:animate-bounce');
      expect(button?.classList).not.toContain('animate-bounce');
    });

    it('REQ-A11: las imágenes de proyectos se cargan de forma diferida', () => {
      const images = Array.from(root.querySelectorAll('#projects img'));
      expect(images.length).toBe(3);
      images.forEach((img) => expect(img.getAttribute('loading')).toBe('lazy'));
    });
  });
});
