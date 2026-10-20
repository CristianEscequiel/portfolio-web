import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faAngular,
  faCss3,
  faHtml5,
  faJs,
  faNodeJs,
  faPostgresql,
  faPython,
  faTailwindCss,
} from '@fortawesome/free-brands-svg-icons';

export interface ExperienceRole {
  period: string;
  title: string;
  paragraphs: readonly string[];
  tags: readonly string[];
}

/** Una empresa (o actividad) en la línea de tiempo, con uno o más puestos adentro. */
export interface ExperienceEntry {
  company?: string;
  team?: string;
  /** Puestos del más reciente al más antiguo. */
  roles: readonly ExperienceRole[];
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectItem {
  title: string;
  /** Archivo en `public/`. Sin imagen, la tarjeta se muestra solo con texto. */
  image?: string;
  imageAlt?: string;
  description: string;
  tags: readonly string[];
  status: string;
  /** Clases completas de Tailwind (si se arman por partes, el compilador no las detecta). */
  statusClass: string;
  /** Enlace "Ver demo": va junto al estado, antes de los enlaces de código. */
  demoUrl?: string;
  links: readonly ProjectLink[];
  /** Tarjeta a todo el ancho. */
  featured?: boolean;
}

export interface TechItem {
  name: string;
  icon: IconDefinition;
  /** Clase completa de Tailwind con el color al hacer hover. */
  hoverClass: string;
}

export const EXPERIENCE: readonly ExperienceEntry[] = [
  {
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

const STATUS_PRODUCTION = 'border-success text-success';
const STATUS_DEVELOPMENT = 'border-warning text-warning';

export const PROJECTS: readonly ProjectItem[] = [
  {
    title: 'CMMS · Gestión de órdenes de mantenimiento',
    image: 'cmms.jpg',
    imageAlt: 'Panel del CMMS para la gestión de órdenes de mantenimiento',
    description:
      'Solución para la gestión integral de órdenes de mantenimiento, en evolución continua. Frontend en Angular con autenticación JWT, roles (administrador, team leader, técnico y producción), maestro de máquinas con árbol de partes, y flujo de tomar, cerrar y liberar órdenes. Backend propio en Spring Boot con PostgreSQL, donde el servidor es la autoridad de roles y transiciones de estado. Desarrollado con spec-driven development, dejando registro de cada decisión técnica.',
    tags: ['Angular', 'TypeScript', 'Signals', 'Spring Boot', 'PostgreSQL', 'JWT', 'Docker'],
    status: 'En desarrollo',
    statusClass: STATUS_DEVELOPMENT,
    demoUrl: 'https://lab.esceweb.com/dashboard',
    links: [
      { label: 'GitHub · Frontend', url: 'https://github.com/CristianEscequiel/angular-enterprise-lab' },
      { label: 'GitHub · API', url: 'https://github.com/CristianEscequiel/angular-enterprise-lab-api' },
    ],
    featured: true,
  },
  {
    title: 'Catálogo Online Fullstack',
    image: 'catalogo-fullstack.jpg',
    imageAlt: 'Catálogo Online Fullstack',
    description:
      'Plataforma fullstack en producción para gestión y visualización de productos, con autenticación, carrito de compras y panel administrativo. Arquitectura desacoplada desarrollada con Angular y NestJS, persistencia en PostgreSQL y despliegue dockerizado con dominio propio.',
    tags: ['Angular', 'TailwindCSS', 'DaisyUI', 'NestJS', 'PostgreSQL', 'Docker'],
    status: 'En producción',
    statusClass: STATUS_PRODUCTION,
    demoUrl: 'https://catalog.esceweb.com/home',
    links: [{ label: 'GitHub', url: 'https://github.com/CristianEscequiel/mi-catalogo-online/' }],
  },
  {
    title: 'Landing + Catálogo Estático',
    image: 'landing-react.jpg',
    imageAlt: 'Landing + catálogo estático en React',
    description:
      'Solución frontend orientada a catálogos comerciales, desarrollada con React, TypeScript y Vite. Diseño reutilizable con configuración dinámica de contenido y temas, optimizada para rendimiento, escalabilidad visual y experiencia responsive.',
    tags: ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'React Router'],
    status: 'En producción',
    statusClass: STATUS_PRODUCTION,
    demoUrl: 'https://landing.esceweb.com',
    links: [{ label: 'GitHub', url: 'https://github.com/CristianEscequiel/catalog-react' }],
  },
];

export const TECHNOLOGIES: readonly TechItem[] = [
  { name: 'HTML', icon: faHtml5, hoverClass: 'group-hover:text-orange-500' },
  { name: 'JavaScript', icon: faJs, hoverClass: 'group-hover:text-yellow-400' },
  { name: 'CSS', icon: faCss3, hoverClass: 'group-hover:text-blue-500' },
  { name: 'Tailwind', icon: faTailwindCss, hoverClass: 'group-hover:text-sky-400' },
  { name: 'Angular', icon: faAngular, hoverClass: 'group-hover:text-red-500' },
  { name: 'PostgreSQL', icon: faPostgresql, hoverClass: 'group-hover:text-blue-400' },
  { name: 'NodeJS', icon: faNodeJs, hoverClass: 'group-hover:text-green-500' },
  { name: 'Python', icon: faPython, hoverClass: 'group-hover:text-yellow-500' },
];
