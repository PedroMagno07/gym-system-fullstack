class MobileNavbar {
  constructor(mobileMenu, navList, navLinks) {
    this.mobileMenu = document.querySelector(mobileMenu);
    this.navList = document.querySelector(navList);
    this.navLinks = document.querySelectorAll(navLinks);
    this.activeClass = "active";

    // Garante que 'this' dentro de handleClick se refira à instância da classe
    this.handleClick = this.handleClick.bind(this);
  }

  animateLinks() {
    this.navLinks.forEach((link, index) => {
      // Alterna a animação: se já tem, remove. Se não tem, aplica.
      link.style.animation
        ? (link.style.animation = "")
        : (link.style.animation = `navLinkFade 0.5s ease forwards ${
            index / 7 + 0.3 // Pequeno delay para efeito cascata
          }s`);
    });
  }

  handleClick() {
    // 1. Abre/fecha o menu lateral
    this.navList.classList.toggle(this.activeClass);

    // 2. Transforma o ícone (sanduíche <-> X)
    this.mobileMenu.classList.toggle(this.activeClass);

    // 3. Anima os links
    this.animateLinks();
  }

  addClickEvent() {
    if (this.mobileMenu) {
      this.mobileMenu.addEventListener("click", this.handleClick);
    }
  }

  init() {
    this.addClickEvent();
    return this;
  }
}

// Inicializa a navegação passando os seletores CSS
const mobileNavbar = new MobileNavbar(
  ".mobile-menu",
  ".nav-list",
  ".nav-list li"
);
mobileNavbar.init();
