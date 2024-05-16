import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  main_links: any[] = [
    {
      link: 'https://www.linkedin.com/in/guilherme-fran%C3%A7a-da-silva-4756a8155',
      icon: 'https://guilhermefdsilva.github.io/read-db-myPortfolio/logos/linkedin.svg',
      description: 'Linkedin'
    },
    {
      link: 'https://github.com/GuilhermeFdSilva',
      icon: 'https://guilhermefdsilva.github.io/read-db-myPortfolio/logos/gitHub.svg',
      description: 'GitHub'
    },
  ]
}
