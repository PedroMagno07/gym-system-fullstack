// --- CLASSE ORIGINAL DA NAVBAR (Restaurada) ---
class MobileNavbar {
  constructor(mobileMenu, navList, navLinks) {
    this.mobileMenu = document.querySelector(mobileMenu);
    this.navList = document.querySelector(navList);
    this.navLinks = document.querySelectorAll(navLinks);
    this.activeClass = "active";
    this.handleClick = this.handleClick.bind(this);
  }

  animateLinks() {
    this.navLinks.forEach((link, index) => {
      link.style.animation
        ? (link.style.animation = "")
        : (link.style.animation = `navLinkFade 0.5s ease forwards ${
            index / 7 + 0.3
          }s`);
    });
  }

  handleClick() {
    this.navList.classList.toggle(this.activeClass);
    this.mobileMenu.classList.toggle(this.activeClass);
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

// Inicializa a Navbar Original
const mobileNavbar = new MobileNavbar(
  ".mobile-menu",
  ".nav-list",
  ".nav-list li"
);
mobileNavbar.init();


// --- FUNÇÃO PARA OS CARDS DE NOTIFICAÇÃO ---
function toggleCard(element) {
    element.classList.toggle('expanded');
}