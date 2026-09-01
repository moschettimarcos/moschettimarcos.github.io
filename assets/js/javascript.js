// --- Lógica do Tema Claro/Escuro (Light/Dark Mode) ---
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleMobileBtn = document.getElementById('theme-toggle-mobile');
const themeIconLight = document.getElementById('theme-icon-light');
const themeIconDark = document.getElementById('theme-icon-dark');
const themeIconLightMobile = document.getElementById('theme-icon-light-mobile');
const themeIconDarkMobile = document.getElementById('theme-icon-dark-mobile');
const themeTextMobile = document.getElementById('theme-text-mobile'); // Adicionado para o texto do botão mobile

// Função para atualizar os ícones e texto do botão
function updateThemeUI() {
    const isDarkMode = document.documentElement.classList.contains('dark');

    if (isDarkMode) {
        if(themeIconLight) themeIconLight.classList.remove('hidden');
        if(themeIconDark) themeIconDark.classList.add('hidden');
        if(themeIconLightMobile) themeIconLightMobile.classList.remove('hidden');
        if(themeIconDarkMobile) themeIconDarkMobile.classList.add('hidden');
        if (themeTextMobile) themeTextMobile.textContent = 'Mudar para tema claro';
    } else {
        if(themeIconLight) themeIconLight.classList.add('hidden');
        if(themeIconDark) themeIconDark.classList.remove('hidden');
        if(themeIconLightMobile) themeIconLightMobile.classList.add('hidden');
        if(themeIconDarkMobile) themeIconDarkMobile.classList.remove('hidden');
        if (themeTextMobile) themeTextMobile.textContent = 'Mudar para tema escuro';
    }
}

// Função para alternar o tema
function toggleTheme() {
    const isDarkMode = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateThemeUI();
}

// Adiciona listeners aos botões
if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
if (themeToggleMobileBtn) themeToggleMobileBtn.addEventListener('click', toggleTheme);

// Verifica a preferência do usuário no carregamento da página
document.addEventListener('DOMContentLoaded', () => {
    // 1. Garante que todos os outros ícones (Lucide) sejam criados.
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Define o tema inicial (claro ou escuro) com base na preferência salva ou do sistema.
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
    }

    // 3. Atualiza a UI do botão de tema e os ícones de competências para refletir o tema inicial.
    updateThemeUI();
});

// --- Lógica do Menu Mobile (Abertura/Fechamento) ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');
const closeIcon = document.getElementById('close-icon');

function closeMobileMenu() {
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        if (menuIcon) menuIcon.classList.remove('hidden');
        if (closeIcon) closeIcon.classList.add('hidden');
    }
}

if (mobileMenuButton && mobileMenu && menuIcon && closeIcon) {
    mobileMenuButton.addEventListener('click', () => {
        const isMenuOpen = mobileMenu.classList.toggle('hidden');
        // A lógica de toggle do ícone precisa ser robusta
        if (!isMenuOpen) { // Se o menu NÃO está escondido (está aberto)
            menuIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
        } else {
            menuIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    });

    // Garante que o menu feche ao clicar em qualquer link ou botão (ex: botão de tema) dentro dele
    const mobileLinks = mobileMenu.querySelectorAll('a, button');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

// --- Lógica de Scroll Suave para TODOS os links âncora ---
// Seleciona links do header (desktop E mobile) que começam com #

// Enquanto o scroll suave de um clique está em andamento, o ScrollSpy (abaixo)
// fica pausado para não "brigar" com o destaque já aplicado no clique.
let isProgrammaticNavScroll = false;
let programmaticScrollTimeout;

const navPill = document.getElementById('nav-pill');

function moveNavPill(link) {
    if (!navPill) return;
    if (!link) {
        navPill.classList.remove('is-visible');
        return;
    }
    navPill.style.width = `${link.offsetWidth}px`;
    navPill.style.transform = `translateX(${link.offsetLeft}px)`;
    navPill.classList.add('is-visible');
}

function setActiveNavLink(sectionId) {
    let desktopActiveLink = null;
    navLinks.forEach(link => {
        const isDesktopLink = !!link.closest('#nav-links-track');
        link.classList.remove('text-blue-600', 'dark:text-blue-400', 'bg-blue-50', 'dark:bg-blue-900/30');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('text-blue-600', 'dark:text-blue-400');
            if (isDesktopLink) {
                desktopActiveLink = link;
            } else {
                // Sem pílula deslizante no menu mobile: mantém o destaque com fundo sólido
                link.classList.add('bg-blue-50', 'dark:bg-blue-900/30');
            }
        }
    });
    moveNavPill(desktopActiveLink);
}

window.addEventListener('resize', () => {
    const currentActive = document.querySelector('#nav-links-track a.text-blue-600');
    if (!currentActive) return;
    navPill.style.transition = 'none';
    moveNavPill(currentActive);
    requestAnimationFrame(() => {
        navPill.style.transition = '';
    });
});

document.querySelectorAll('header a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Previne o salto imediato padrão

        const targetId = this.getAttribute('href');

        // O link "Contato" do topo tem href="#contato", assim como o da seção Hero.
        // O link "Home" (Logo) tem href="#home".
        if (targetId) {
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Destaca o item do menu imediatamente, sem esperar o scroll terminar
                if (this.classList.contains('nav-link')) {
                    isProgrammaticNavScroll = true;
                    clearTimeout(programmaticScrollTimeout);
                    setActiveNavLink(targetId.slice(1));
                    programmaticScrollTimeout = setTimeout(() => {
                        isProgrammaticNavScroll = false;
                    }, 1000);
                }

                // Rola suavemente até o elemento
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});


// --- Lógica do Botão Voltar ao Topo ---
const backToTopButton = document.getElementById('back-to-top');

if (backToTopButton) {
    let isScrolling = false;

    const handleScroll = () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 300) {
                        backToTopButton.classList.remove('hidden', 'opacity-0', 'translate-y-4', 'pointer-events-none');
                        backToTopButton.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
                } else {
                        backToTopButton.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
                        backToTopButton.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
                }
                isScrolling = false;
            });
            isScrolling = true;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// --- Lógica da Animação nos Cards de Competência ---
// O efeito de hover é controlado puramente por CSS.
// O código abaixo, que adicionava um efeito de 'flip' ou 'toggle' no clique,
// foi removido para que o card não mude de cor permanentemente após ser clicado.



// --- Lógica do Modal de Detalhes (Certificados e Experiência) ---
const detailsModal = document.getElementById('details-modal');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalCloseButton = document.getElementById('modal-close-button');
let focusedElementBeforeModal; // Para armazenar o elemento focado antes de abrir o modal

const academicCards = document.querySelectorAll('.academic-card'); // Novo seletor para cards acadêmicos
const experienceCards = document.querySelectorAll('.experience-card');

function openModal(title, content) {
    if (!detailsModal || !modalTitle || !modalBody) return;

    focusedElementBeforeModal = document.activeElement; // Armazena o elemento focado

    // Reseta as cores dinâmicas para que o modal genérico volte a usar o azul padrão do portfólio
    detailsModal.style.removeProperty('--dynamic-color');
    detailsModal.style.removeProperty('--dynamic-color-rgb');

    modalTitle.textContent = title;
    modalBody.innerHTML = content; // Usamos innerHTML para caso o conteúdo tenha tags

    detailsModal.classList.remove('hidden');
    detailsModal.setAttribute('aria-hidden', 'false'); // Para acessibilidade
    setTimeout(() => {
        detailsModal.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
        lucide.createIcons(); // Recria ícones do Lucide caso o modal tenha algum
        modalContent.focus(); // Foca no conteúdo do modal
    }, 10); // Pequeno delay para a transição funcionar
}

function closeModal() {
    if (!detailsModal) return;

    detailsModal.setAttribute('aria-hidden', 'true'); // Para acessibilidade
    detailsModal.classList.add('opacity-0');
    modalContent.classList.add('scale-95');
    setTimeout(() => {
        detailsModal.classList.add('hidden');
        if (focusedElementBeforeModal) {
            focusedElementBeforeModal.focus(); // Retorna o foco ao elemento original
        }
    }, 300); // Espera a transição terminar
}

// Função para ser chamada pelo evento de scroll
function closeModalOnScroll() {
    closeModal();
}

// --- Lógica de Acessibilidade do Modal (Focus Trap e Escape) ---
if (detailsModal) {
    // Torna o modal programaticamente focável
    modalContent.setAttribute('tabindex', '-1');

    detailsModal.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
        if (e.key === 'Tab') {
            // Implementa o focus trap
            const focusableElements = modalContent.querySelectorAll(
                'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])'
            );
            const firstFocusableElement = focusableElements[0];
            const lastFocusableElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstFocusableElement || document.activeElement === modalContent) {
                    lastFocusableElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastFocusableElement) {
                    firstFocusableElement.focus();
                    e.preventDefault();
                }
            }
        }
    });

    // Garante que o foco inicial vá para o modal quando ele abre
    // Isso é feito na função openModal com modalContent.focus()
}

// Remove o listener de scroll que fechava o modal, pois pode prejudicar a acessibilidade
// e usabilidade para alguns usuários.
// window.removeEventListener('wheel', closeModalOnScroll); // Já removido do openModal
// Se você tinha isso em algum outro lugar, certifique-se de removê-lo.


// Event Listeners para os cards de formação acadêmica
academicCards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.dataset.title;
        const details = card.dataset.details;
        if (title && details) {
            openModal(title, `<p>${details}</p>`);
        }
    });

    // Acessibilidade: Permite abrir com a tecla Enter
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            card.click();
        }
    });
});

// Event Listeners para os cards de experiência
experienceCards.forEach(card => {
    card.addEventListener('click', () => {
        const title = card.dataset.title;
        const details = card.dataset.details;
        if (title && details) {
            // Transforma quebras de linha em parágrafos para melhor formatação
            const formattedDetails = details.split('\n').map(p => `<p>${p}</p>`).join('');
            openModal(title, formattedDetails);
        }
    });

    // Acessibilidade: Permite abrir com a tecla Enter
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            card.click();
        }
    });
});

// Event Listeners para fechar o modal
if (modalCloseButton) {
    modalCloseButton.addEventListener('click', closeModal);
}

// Adiciona acessibilidade para os projetos via teclado
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') card.click();
    });
});
if (detailsModal) {
    detailsModal.addEventListener('click', (e) => {
        // Fecha o modal se o clique for no fundo (fora do conteúdo)
        if (e.target === detailsModal) {
            closeModal();
        }
    });
}

// --- Lógica da Animação de Fade-in das Seções ---
const animatedElements = document.querySelectorAll('.fade-in-section');

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        } else {
            // Opcional: remove a classe quando o elemento sai da tela para re-animar
            entry.target.classList.remove('is-visible');
        }
    });
}, {
    rootMargin: '0px',
    threshold: 0.15 // A seção se torna visível quando 15% dela está na tela
});

animatedElements.forEach(el => {
    sectionObserver.observe(el);
});
// Adiciona a classe de animação a todas as seções principais também
document.querySelectorAll('section').forEach(section => {
    if (!section.classList.contains('fade-in-section')) {
        section.classList.add('fade-in-section');
        sectionObserver.observe(section);
    }
});

// --- Lógica das Animações de Scroll Reveal ---
const scrollRevealElements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');

const scrollRevealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        } else {
            entry.target.classList.remove('revealed');
        }
    });
}, {
    rootMargin: '0px',
    threshold: 0.1
});

scrollRevealElements.forEach(el => {
    scrollRevealObserver.observe(el);
});

// --- Lógica do Header com Scroll ---
const header = document.querySelector('header');

if (header) {
    let isHeaderScrolling = false;
    window.addEventListener('scroll', () => {
        if (isHeaderScrolling) return;
        window.requestAnimationFrame(() => {
            header.classList.toggle('scrolled', window.scrollY > 50);
            isHeaderScrolling = false;
        });
        isHeaderScrolling = true;
    }, { passive: true });
}

// ===== Efeito de Digitação Animado (Typing) =====
const typingText = document.getElementById('typing-text');
const typingRolesByLang = {
    pt: [
        'Analista de QA',
        'Testes Manuais & Exploratórios',
        'Automação com Cypress',
        'Testes de API',
        'Automação com Selenium',
        'BDD & Gherkin'
    ],
    en: [
        'QA Analyst',
        'Manual & Exploratory Testing',
        'Cypress Automation',
        'API Testing',
        'Selenium Automation',
        'BDD & Gherkin'
    ]
};
let roleIndex = 0;
let charIndex = 0;
let isDeletingRole = false;

function initTypingEffect() {
    if (!typingText) return;
    const roles = typingRolesByLang[currentLang] || typingRolesByLang.pt;
    const currentRole = roles[roleIndex];

    if (isDeletingRole) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeletingRole ? 40 : 80;

    if (!isDeletingRole && charIndex === currentRole.length) {
        typeSpeed = 2500; // Pausa longa no fim da palavra antes de apagar
        isDeletingRole = true;
    } else if (isDeletingRole && charIndex === 0) {
        isDeletingRole = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 500; // Pausa curta antes de começar a nova palavra
    }
    setTimeout(initTypingEffect, typeSpeed);
}
setTimeout(initTypingEffect, 1000);

function resetTypingEffect() {
    roleIndex = 0;
    charIndex = 0;
    isDeletingRole = false;
    if (typingText) typingText.textContent = '';
}

// ===== Contador Animado de Estatísticas =====
const counters = document.querySelectorAll('.counter');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = +entry.target.getAttribute('data-target');
            const duration = 2000; // 2 segundos
            const increment = target / (duration / 16);
            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    entry.target.textContent = Math.ceil(current).toLocaleString('pt-BR');
                    requestAnimationFrame(updateCounter);
                } else {
                    entry.target.textContent = target.toLocaleString('pt-BR');
                }
            };
            updateCounter();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
counters.forEach(counter => statsObserver.observe(counter));

// ===== Dados dos Projetos =====
const projectsData = {
    'cypress-api': {
        title: 'Cypress API Automation',
        description: 'Framework de automação de testes de API utilizando Cypress. Abordagem moderna e escalável para validar endpoints REST.',
        technologies: ['Cypress', 'Node.js', 'JavaScript', 'REST API', 'GitHub Actions'],
        features: [
            'Estrutura de testes modular e reutilizável',
            'Validação de respostas JSON',
            'Testes de autenticação e autorização',
            'Integração com CI/CD',
            'Relatórios detalhados de execução'
        ],
        github: 'https://github.com/moschettimarcos/cypress-api-automation'
    },
    'the-internet': {
        title: 'The Internet Cypress',
        description: 'Testes E2E completos utilizando Cypress. Cenários de autenticação, formulários e interações complexas.',
        technologies: ['Cypress', 'E2E', 'Page Object Model', 'Mocha', 'Chai'],
        features: [
            'Padrão Page Object Model',
            'Cenários de login e logout',
            'Validação de formulários',
            'Testes de envio de arquivos',
            'Verificação de mensagens de erro'
        ],
        github: 'https://github.com/moschettimarcos/the-internet-cypress'
    },
    'dealership': {
        title: 'Dealership Management System',
        description: 'Sistema completo em Java para gestão de concessionária. Permite registrar e gerenciar veículos, clientes e funcionários com persistência de dados em arquivos.',
        technologies: ['Java', 'POO', 'I/O', 'Console App', 'Clean Code'],
        features: [
            'Gestão completa de veículos (Carros e Motos)',
            'Cadastro e gerenciamento de clientes',
            'Gestão de funcionários',
            'Operações CRUD completas',
            'Persistência de dados em arquivos de texto',
            'Interface de linha de comando intuitiva'
        ],
        github: 'https://github.com/moschettimarcos/Dealership-Management-System'
    },
    'selenium-e2e': {
        title: 'Selenium WebDriver E2E',
        description: 'Projeto de automação de testes End-to-End (E2E) desenvolvido em Java com JUnit 5. O objetivo é demonstrar a resolução de desafios técnicos avançados em testes de interface interativos.',
        technologies: ['Selenium 4', 'Java 21', 'JUnit 5', 'Maven'],
        features: [
            'Ações Complexas de Mouse via classe Actions',
            'Bypass de Autenticação Básica HTTP via URL',
            'Controles Dinâmicos e Esperas Explícitas',
            'Mudança de Contexto para iFrames e Frames Aninhados',
            'Injeção de JavaScript para Rolagem Infinita',
            'Interação Direta com Shadow DOM',
            'Lógica de Envio e Download de Arquivos'
        ],
        github: 'https://github.com/moschettimarcos/the-internet-selenium'
    },
    'the-internet-robot': {
        title: 'The Internet Robot',
        description: 'Projeto profissional de automação utilizando Robot Framework + Selenium WebDriver para o site the-internet.herokuapp.com. Implementação focada em estabilidade, reusabilidade e boas práticas de engenharia de testes.',
        technologies: ['Robot Framework', 'Python', 'Selenium WebDriver', 'GitHub Actions', 'Page Object Model'],
        features: [
            'Arquitetura baseada em Page Object Model (POM)',
            'Criação de Palavras-chave (Keywords) reutilizáveis e modulares',
            'Pipeline de CI/CD automatizada com GitHub Actions',
            'Testes de Login, Menus Suspensos e Caixas de Seleção',
            'Validação de Alertas, Efeitos Hover e Controles Dinâmicos',
            'Interações com Campos de Texto e Pressionamento de Teclas'
        ],
        github: 'https://github.com/moschettimarcos/the-internet-robot'
    },
    'playwright-framework': {
        title: 'Playwright Automation Framework',
        description: 'Framework de automação de testes construído com Playwright, cobrindo testes de API, E2E e regressão visual, com Page Object Model, Data-Driven Testing e pipeline de CI/CD.',
        technologies: ['Playwright', 'JavaScript', 'Node.js', 'API Testing', 'GitHub Actions'],
        features: [
            'Testes de API, E2E e regressão visual em um único framework',
            'Arquitetura baseada em Page Object Model (POM)',
            'Data-Driven Testing com massas de dados externas',
            'Execução multi-navegador (Chromium, Firefox e WebKit)',
            'Pipeline de CI/CD automatizada com GitHub Actions',
            'Relatórios HTML com traces, screenshots e vídeos de falhas'
        ],
        github: 'https://github.com/moschettimarcos/playwright-framework-estudo'
    },
    'appium-mobile': {
        title: 'Ecommerce Mobile Automation',
        description: 'Framework de automação de testes para Android com Appium e Pytest, aplicando Page Object Model. Cobre o fluxo completo de um e-commerce fictício: login, catálogo, carrinho e checkout.',
        technologies: ['Appium', 'Python', 'Pytest', 'UiAutomator2', 'Page Object Model'],
        features: [
            'Arquitetura baseada em Page Object Model (POM) com Component Objects reutilizáveis',
            'Suítes de smoke e regressão organizadas por marcadores do Pytest',
            'Cobertura de login, catálogo, ordenação, carrinho e checkout completo',
            'Testes negativos com validação de mensagens de erro conferidas ao vivo no emulador',
            'Configuração via variáveis de ambiente (.env) para portabilidade entre máquinas',
            'Relatórios de execução com Allure'
        ],
        github: 'https://github.com/moschettimarcos/ecommerce-mobile-automation'
    }
};

// ===== Sistema de Temas Dinâmicos por Framework =====
const frameworkThemes = {
    'cypress': { color: '#10B981', rgb: '16, 185, 129', logo: 'https://cdn.simpleicons.org/cypress/10B981' },
    'java': { color: '#F97316', rgb: '249, 115, 22', logo: 'https://api.iconify.design/fa6-brands:java.svg?color=%23F97316' },
    'robot framework': { color: '#00C0E3', rgb: '0, 192, 227', logo: 'https://cdn.simpleicons.org/robotframework/00C0E3' },
    'selenium': { color: '#43B02A', rgb: '67, 176, 42', logo: 'https://cdn.simpleicons.org/selenium/43B02A' },
    'react': { color: '#06B6D4', rgb: '6, 182, 212', logo: 'https://cdn.simpleicons.org/react/06B6D4' },
    'python': { color: '#FACC15', rgb: '250, 204, 21', logo: 'https://cdn.simpleicons.org/python/FACC15' },
    'node': { color: '#22C55E', rgb: '34, 197, 94', logo: 'https://cdn.simpleicons.org/nodedotjs/22C55E' },
    'typescript': { color: '#3B82F6', rgb: '59, 130, 246', logo: 'https://cdn.simpleicons.org/typescript/3B82F6' },
    'playwright': { color: '#D33833', rgb: '211, 56, 51', logo: 'https://api.iconify.design/logos:playwright.svg' },
    'appium': { color: '#7C3AED', rgb: '124, 58, 237', logo: 'https://cdn.simpleicons.org/appium/7C3AED' },
    'default': { color: '#3B82F6', rgb: '59, 130, 246', logo: '' }
};

function getThemeForProject(technologies) {
    if (!technologies || !technologies.length) return frameworkThemes['default'];
    for (let tech of technologies) {
        const normalizedTech = tech.toLowerCase();
        for (let key in frameworkThemes) {
            if (key !== 'default' && normalizedTech.includes(key)) {
                return frameworkThemes[key];
            }
        }
    }
    return frameworkThemes['default'];
}

// ===== Função para abrir modal de projeto =====
function openProjectModal(projectId) {
    const project = projectsData[projectId];
    if (!project) return;

    const modal = document.getElementById('details-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    // Detecta o tema dinâmico baseado na stack e aplica no Modal
    const theme = getThemeForProject(project.technologies);
    modal.style.setProperty('--dynamic-color', theme.color);
    modal.style.setProperty('--dynamic-color-rgb', theme.rgb);

    const lang = getInitialLanguage();
    const techText = lang === 'en' ? 'Technologies' : 'Tecnologias';
    const featuresText = lang === 'en' ? 'Features' : 'Funcionalidades';
    const btnText = lang === 'en' ? 'View on GitHub' : 'Ver no GitHub';

    const desc = project.description;
    const feats = project.features;

    modalTitle.textContent = project.title;

    modalBody.innerHTML = `
        <div class="flex flex-col">
            <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">${desc}</p>

            <div class="mt-8">
                <h4 class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">${techText}</h4>
                <div class="flex flex-wrap gap-2">
                    ${project.technologies.map(tech => `<span class="px-3 py-1 dynamic-badge rounded-lg text-sm font-medium cursor-default">${tech}</span>`).join('')}
                </div>
            </div>

            <div class="mt-8">
                <h4 class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">${featuresText}</h4>
                <ul class="space-y-2.5">
                    ${feats.map(feature => `
                        <li class="flex items-start gap-2.5 text-gray-700 dark:text-gray-300">
                            <span class="dynamic-text mt-1 shrink-0">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </span>
                            <span>${feature}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>

            <div class="mt-8">
                <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-6 py-2.5 dynamic-btn rounded-lg font-semibold">
                    <span>${btnText}</span>
                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
                </a>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('#modal-content').classList.remove('scale-95');
    }, 10);
}

// ===== Filtro de tecnologia dos Projetos =====
const projectFilterBar = document.getElementById('project-filter-bar');
if (projectFilterBar) {
    projectFilterBar.addEventListener('click', (e) => {
        const pill = e.target.closest('.project-filter-pill');
        if (!pill) return;

        // Clicar de novo no filtro já ativo desmarca e volta pro "Todos"
        const isAllPill = pill.dataset.filter === 'all';
        const filter = (pill.classList.contains('active') && !isAllPill) ? 'all' : pill.dataset.filter;

        projectFilterBar.querySelectorAll('.project-filter-pill').forEach(p => {
            p.classList.toggle('active', p.dataset.filter === filter);
        });

        document.querySelectorAll('#projects-grid .project-card').forEach(card => {
            const techs = (card.dataset.tech || '').split(' ');
            const matches = filter === 'all' || techs.includes(filter);
            card.classList.toggle('project-dimmed', !matches);
            // Os projetos que combinam com o filtro sobem para o início da grade
            card.style.order = filter === 'all' ? '' : (matches ? '0' : '1');
        });
    });
}

// ===== Rotação do projeto em destaque =====
const featuredProjectCards = Array.from(document.querySelectorAll('#projects-grid .project-card'));
if (featuredProjectCards.length) {
    let featuredProjectIndex = featuredProjectCards.findIndex(card => card.classList.contains('project-featured'));
    if (featuredProjectIndex === -1) featuredProjectIndex = 0;

    // O destaque atual sempre aparece primeiro na grade
    featuredProjectCards[featuredProjectIndex].style.order = '-1';

    setInterval(() => {
        featuredProjectCards[featuredProjectIndex].classList.remove('project-featured');
        featuredProjectCards[featuredProjectIndex].style.order = '';
        featuredProjectIndex = (featuredProjectIndex + 1) % featuredProjectCards.length;
        featuredProjectCards[featuredProjectIndex].classList.add('project-featured');
        featuredProjectCards[featuredProjectIndex].style.order = '-1';
    }, 120000);
}

// ===== Spotlight de cursor nos cards de Projeto, Experiência, Certificados e Formação =====
function attachCursorSpotlight(card) {
    let spotlightTicking = false;
    let pendingX = 0;
    let pendingY = 0;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        pendingX = e.clientX - rect.left;
        pendingY = e.clientY - rect.top;

        if (!spotlightTicking) {
            spotlightTicking = true;
            requestAnimationFrame(() => {
                card.style.setProperty('--mouse-x', `${pendingX}px`);
                card.style.setProperty('--mouse-y', `${pendingY}px`);
                spotlightTicking = false;
            });
        }
    });
}

document.querySelectorAll('.project-card, .experience-card, .academic-card').forEach(attachCursorSpotlight);

// ===== Adicionar evento de fechar modal =====
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('details-modal');
    const modalCloseButton = document.getElementById('modal-close-button');

    if (modalCloseButton) {
        modalCloseButton.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Fechar modal ao fazer scroll
    window.addEventListener('scroll', () => {
        if (!modal.classList.contains('hidden')) {
            closeModal();
        }
    }, { passive: true });
});

// ===== Simulador de Terminal (Pipeline QA) =====
const terminalOutput = document.getElementById('terminal-output');
const terminalLogsByLang = {
    pt: [
        { type: 'cmd', text: '$ npm test' },
        { type: 'info', text: '> Iniciando execução dos testes...' },
        { type: 'success', text: '✓ [PASS] Validação de contrato da API (0.6s)' },
        { type: 'success', text: '✓ [PASS] Fluxo de autenticação (0.8s)' },
        { type: 'success', text: '✓ [PASS] Testes de regressão (1.2s)' },
        { type: 'success', text: '✓ [PASS] Validação de schema (0.9s)' },
        { type: 'info', text: '> Gerando relatório de execução...' },
        { type: 'success', text: '✓ Suíte concluída com sucesso' },
        { type: 'cmd', text: '$ echo "Pronto para revisão"' }
    ],
    en: [
        { type: 'cmd', text: '$ npm test' },
        { type: 'info', text: '> Starting test run...' },
        { type: 'success', text: '✓ [PASS] API contract validation (0.6s)' },
        { type: 'success', text: '✓ [PASS] Authentication flow (0.8s)' },
        { type: 'success', text: '✓ [PASS] Regression tests (1.2s)' },
        { type: 'success', text: '✓ [PASS] Schema validation (0.9s)' },
        { type: 'info', text: '> Generating execution report...' },
        { type: 'success', text: '✓ Suite completed successfully' },
        { type: 'cmd', text: '$ echo "Ready for review"' }
    ]
};
let logIndex = 0;
let terminalStarted = false;
let terminalTimeoutId = null;
const terminalObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !terminalStarted) {
        terminalStarted = true;
        printTerminalLog();
    }
}, { threshold: 0.5 });
if (terminalOutput) terminalObserver.observe(terminalOutput);
function printTerminalLog() {
    const logs = terminalLogsByLang[currentLang] || terminalLogsByLang.pt;
    if (logIndex >= logs.length) {
        // Adiciona um cursor de bash piscando ao final da execução
        const cursorLine = document.createElement('div');
        cursorLine.className = 'log-line log-cmd mt-2';
        cursorLine.innerHTML = '<span class="typing-cursor" style="margin-left: 0; opacity: 0.7;"></span>';
        terminalOutput.appendChild(cursorLine);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        return;
    }
    const log = logs[logIndex];
    const line = document.createElement('div');
    line.className = `log-line log-${log.type}`;
    line.textContent = log.text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    logIndex++;
    const delay = log.type === 'cmd' ? 800 : (Math.random() * 400 + 100);
    terminalTimeoutId = setTimeout(printTerminalLog, delay);
}

function resetTerminal() {
    if (!terminalOutput) return;
    clearTimeout(terminalTimeoutId);
    logIndex = 0;
    terminalOutput.innerHTML = '';
    if (terminalStarted) printTerminalLog();
}

// ===== Barra de Progresso de Leitura (Scroll) =====
const scrollProgress = document.getElementById('scroll-progress');
if (scrollProgress) {
    let isProgressScrolling = false;
    let scrollTimeout;

    window.addEventListener('scroll', () => {
        // Mostra a barra imediatamente ao iniciar a rolagem
        scrollProgress.style.opacity = '1';
        clearTimeout(scrollTimeout);

        if (!isProgressScrolling) {
            window.requestAnimationFrame(() => {
                const totalScroll = document.documentElement.scrollTop;
                const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scroll = `${(totalScroll / windowHeight) * 100}%`;
                scrollProgress.style.width = scroll;
                isProgressScrolling = false;
            });
            isProgressScrolling = true;
        }

        // Oculta a barra suavemente após 1.2 segundos (1200ms) sem rolagem
        scrollTimeout = setTimeout(() => {
            scrollProgress.style.opacity = '0';
        }, 1200);
    }, { passive: true });
}

// ===== Efeito de Ripple nos Botões =====
const buttons = document.querySelectorAll('button, a');

buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 400);
    });
});

// ===== ScrollSpy (Detecção de Rolagem no Menu Ativo) =====
const sectionsSpy = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

let isSpyScrolling = false;
window.addEventListener('scroll', () => {
    // Enquanto um clique no menu ainda está com o scroll suave em andamento,
    // o destaque já foi aplicado instantaneamente — não deixa o ScrollSpy sobrescrever.
    if (isProgrammaticNavScroll || isSpyScrolling) return;

    window.requestAnimationFrame(() => {
        let current = '';
        // Descobre qual seção está na tela
        sectionsSpy.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 250)) { // 250px de margem pelo header
                current = section.getAttribute('id');
            }
        });

        setActiveNavLink(current);
        isSpyScrolling = false;
    });
    isSpyScrolling = true;
}, { passive: true });

// ===== Carrossel infinito de Certificados =====
const certTrack = document.getElementById('certificates-grid');
const certPrevBtn = document.getElementById('cert-prev');
const certNextBtn = document.getElementById('cert-next');

if (certTrack && certPrevBtn && certNextBtn) {
    const originalCerts = Array.from(certTrack.querySelectorAll('.academic-card'));
    const setSize = originalCerts.length;

    // Clona o conjunto inteiro antes e depois do original, para que rolar até
    // qualquer ponta sempre encontre mais certificados — nunca um fim de fato.
    const cloneBefore = originalCerts.map(card => card.cloneNode(true));
    const cloneAfter = originalCerts.map(card => card.cloneNode(true));

    const fragBefore = document.createDocumentFragment();
    cloneBefore.forEach(card => fragBefore.appendChild(card));
    certTrack.insertBefore(fragBefore, certTrack.firstChild);

    const fragAfter = document.createDocumentFragment();
    cloneAfter.forEach(card => fragAfter.appendChild(card));
    certTrack.appendChild(fragAfter);

    // Clones não herdam os listeners de clique/teclado nem o spotlight de
    // cursor (cloneNode só copia atributos, não os listeners já anexados
    // aos cards originais), então recriamos os dois aqui.
    [...cloneBefore, ...cloneAfter].forEach(card => {
        attachCursorSpotlight(card);
        card.addEventListener('click', () => {
            const title = card.dataset.title;
            const details = card.dataset.details;
            if (title && details) openModal(title, `<p>${details}</p>`);
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') card.click();
        });
    });

    const allCerts = Array.from(certTrack.querySelectorAll('.academic-card'));
    const setWidth = allCerts[setSize].getBoundingClientRect().left - allCerts[0].getBoundingClientRect().left;

    let isCertProgrammaticScroll = false;
    let certProgrammaticScrollTimeout;

    function centerOn(card, smooth) {
        const trackRect = certTrack.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const delta = (cardRect.left + cardRect.width / 2) - (trackRect.left + trackRect.width / 2);
        if (smooth) {
            // Enquanto essa rolagem suave está em andamento, o recentralizador
            // (mais abaixo) não deve interferir e brigar com ela no meio do caminho.
            isCertProgrammaticScroll = true;
            clearTimeout(certProgrammaticScrollTimeout);
            certTrack.scrollTo({ left: certTrack.scrollLeft + delta, behavior: 'smooth' });
            certProgrammaticScrollTimeout = setTimeout(() => {
                isCertProgrammaticScroll = false;
            }, 500);
        } else {
            certTrack.scrollLeft += delta;
        }
    }

    function getActiveCard() {
        const trackRect = certTrack.getBoundingClientRect();
        const trackCenter = trackRect.left + trackRect.width / 2;
        let closest = allCerts[setSize];
        let closestDist = Infinity;
        allCerts.forEach(card => {
            const r = card.getBoundingClientRect();
            const dist = Math.abs((r.left + r.width / 2) - trackCenter);
            if (dist < closestDist) {
                closestDist = dist;
                closest = card;
            }
        });
        return closest;
    }

    // Índice (0 a setSize-1) do certificado "atual" dentro do conjunto do
    // meio. As setas usam só esse número com módulo — nada de geometria —
    // pra nunca ficar em dúvida sobre qual é o próximo/anterior nas pontas.
    let currentIndex = 0;

    function updateActiveCert() {
        const active = getActiveCard();
        allCerts.forEach(card => card.classList.toggle('cert-active', card === active));
        const activeIdx = allCerts.indexOf(active) - setSize;
        currentIndex = ((activeIdx % setSize) + setSize) % setSize;
    }

    // "Teletransporta" de volta pro conjunto do meio quando o usuário sai
    // inteiramente dele pra um dos clones, sem transição visível — é isso que
    // faz o carrossel parecer infinito em vez de ter começo/fim. Os limites são
    // as bordas do conjunto original (setWidth e 2*setWidth), não o meio dele —
    // um valor errado aqui fazia recentralizar no meio da navegação normal.
    function recenterIfNeeded() {
        if (certTrack.scrollLeft < setWidth) {
            certTrack.scrollLeft += setWidth;
        } else if (certTrack.scrollLeft > setWidth * 2) {
            certTrack.scrollLeft -= setWidth;
        }
    }

    function goToIndex(newIndex) {
        currentIndex = ((newIndex % setSize) + setSize) % setSize;
        centerOn(allCerts[setSize + currentIndex], true);
    }

    certNextBtn.addEventListener('click', () => goToIndex(currentIndex + 1));
    certPrevBtn.addEventListener('click', () => goToIndex(currentIndex - 1));

    let certScrollTicking = false;
    certTrack.addEventListener('scroll', () => {
        if (certScrollTicking) return;
        certScrollTicking = true;
        requestAnimationFrame(() => {
            updateActiveCert();
            if (!isCertProgrammaticScroll) recenterIfNeeded();
            certScrollTicking = false;
        });
    }, { passive: true });

    // Rolar o mouse por cima da faixa vertical avança/volta os certificados
    certTrack.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        e.preventDefault();
        certTrack.scrollLeft += e.deltaY;
    }, { passive: false });

    centerOn(allCerts[setSize], false);
    updateActiveCert();
}

// --- Lógica de Internacionalização (i18n) ---
const i18nDictionary = {
    'pt': {
        // Header Menu
        'nav_about': 'Sobre',
        'nav_skills': 'Competências',
        'nav_experience': 'Experiência',
        'nav_projects': 'Projetos',
        'nav_education': 'Formação',
        'nav_contact': 'Contato',
        
        // Hero Section
        'hero_desc': '6+ anos garantindo a qualidade de software através de testes manuais e automação de testes E2E, API e Mobile.',
        'hero_cta_projects': 'Ver Projetos',
        'hero_cta_cv': 'Baixar CV',
        'hero_cta_contact': 'Contato',
        
        // Mobile Menu Text
        'mobile_lang_text': 'Mudar para English',

        // Page translations (Full Page)
        'about_card_desc': 'Achando o que quebra antes do usuário',
        'about_title': 'Sobre Mim',
        'about_p1': 'Trabalho com qualidade de software há mais de 6 anos, passando por fintech, consultoria e produto. Ao longo desse tempo já testei de tudo um pouco — front-end, API, banco de dados, apps mobile, integrações com Salesforce e até arquivos bancários no padrão CNAB — sempre me adaptando ao que o produto e o time pedem no momento.',
        'about_p2': 'Gosto de automatizar o que realmente vale a pena automatizar, mas sei que boa parte do trabalho de QA acontece fora da ferramenta: entender bem o requisito, questionar cedo e cobrir os casos que ninguém pensou. Estou cursando um MBA em Engenharia de Software pela USP/Esalq pra enxergar melhor o lado de quem decide o que construir, não só o de quem testa.',
        'about_p3': 'Fora do trabalho, toco violão e guitarra, jogo bastante e ando de bicicleta.',
        'skills_title': 'Principais Competências',
        'skills_cat1': 'Testes e QA',
        'skills_cat2': 'Ferramentas',
        'skills_cat3': 'Metodologias e Linguagens',
        'exp_title': 'Experiência Profissional',
        'exp_subtitle': '6+ anos atuando em qualidade de software',
        'exp_current': 'Atual',
        'exp_obj_time': 'jun de 2026 - o momento',
        'exp_obj_role': 'Analista de Teste/QA',
        'exp_obj_loc': 'Objective · Remota',
        'exp_obj_b1': '• Testes manuais funcionais e exploratórios de front-end, validando fluxo, usabilidade e consistência visual',
        'exp_obj_b2': '• Testes de API para validar contratos, respostas e integridade dos serviços',
        'exp_obj_b3': '• Conferência de dados em banco de dados para garantir consistência entre aplicação e persistência',
        'exp_obj_b4': '• Monitoramento de aplicações em produção com Datadog para diagnóstico de falhas',
        'exp_obj_modal_title': 'Analista de Teste/QA na Objective',
        'exp_obj_modal_details': "<h4 class='text-lg font-semibold text-blue-300 mb-2'>Testes manuais de front-end:</h4><ul class='list-disc list-inside space-y-2'><li>Testes manuais funcionais e exploratórios de front-end, cobrindo fluxo, usabilidade, responsividade e consistência visual antes de cada entrega.</li><li>Validação de API — contrato, resposta e integridade dos dados por trás da tela.</li><li>Conferência de dados em banco de dados quando o que aparece na tela não bate com o que deveria estar persistido.</li><li>Levantamento de requisitos junto ao time para entender o comportamento esperado antes de desenhar os casos de teste.</li></ul><h4 class='text-lg font-semibold text-blue-300 mt-4 mb-2'>Observabilidade e colaboração:</h4><ul class='list-disc list-inside space-y-2'><li>Monitoramento e investigação de comportamento de aplicações em produção com <strong>Datadog</strong>, rastreando a origem de falhas antes que virem um problema maior.</li><li>Contato direto com o time de desenvolvimento ao longo do ciclo, resolvendo boa parte das questões em conversa em vez de só via bug report formal.</li></ul>",
        'exp_finnet_time': 'abr de 2024 - jun de 2026',
        'exp_finnet_role': 'Analista de Teste/QA',
        'exp_finnet_loc': 'Finnet · Híbrida',
        'exp_finnet_b1': '• Testes manuais de produtos de mapas customizados (CNAB), com planos de teste e cenários documentados',
        'exp_finnet_b2': '• Testes de API com Postman e automação de regressão em Cypress (BDD)',
        'exp_finnet_b3': '• Gestão do ciclo de vida de bugs no Jira e acompanhamento de métricas de qualidade por sprint',
        'exp_finnet_b4': '• Ambientes de teste isolados com Docker e versionamento via GitLab',
        'exp_finnet_modal_title': 'Analista de Teste/QA na Finnet',
        'exp_finnet_modal_details': "<h4 class='text-lg font-semibold text-blue-300 mb-2'>Testes manuais e qualidade:</h4><ul class='list-disc list-inside space-y-2'><li>Testes manuais dos arquivos de mapas customizados no padrão <strong>CNAB</strong> — validação minuciosa, já que qualquer erro impedia o banco de processar o arquivo.</li><li>Elaboração de planos de teste e especificação de cenários complexos, com documentação estruturada de evidências para garantir a rastreabilidade das validações.</li><li>Definição e acompanhamento de métricas de qualidade sprint a sprint, com participação ativa nas cerimônias de Scrum.</li><li>Gestão do ciclo de vida dos bugs no <strong>Jira</strong>, do reporte à confirmação da correção junto ao time responsável.</li></ul><h4 class='text-lg font-semibold text-blue-300 mt-4 mb-2'>Automação e ferramentas:</h4><ul class='list-disc list-inside space-y-2'><li>Testes de integração via API com <strong>Postman</strong> antes de cada entrega.</li><li>Automação de parte da regressão em <strong>Cypress</strong> com <strong>BDD</strong>, padronizando os testes ao longo do ciclo de desenvolvimento e identificando quebras antes de virarem incidente.</li><li>Ambientes de teste isolados e replicáveis com <strong>Docker</strong>, com controle de versão e integração contínua via <strong>GitLab</strong>.</li></ul>",
        'exp_fr_time': 'fev de 2020 - fev de 2024',
        'exp_fr_role': 'Analista de Qualidade Pleno',
        'exp_fr_loc': 'FR Consulting · Remota',
        'exp_fr_b1': '• Testes manuais funcionais, de layout e stress em apps Mobile (Android/iOS) e validações no Salesforce',
        'exp_fr_b2': '• Cenários BDD, testes de API (Postman/Swagger) e consultas SQL/DB2 para validação de dados',
        'exp_fr_b3': '• Gestão do ciclo de bugs no Jira e simulações em ambientes de homologação e produção',
        'exp_fr_b4': '• Administração do Salesforce e criação de dashboards de qualidade',
        'exp_fr_modal_title': 'Analista de Qualidade Pleno na FR Consulting',
        'exp_fr_modal_details': "<h4 class='text-lg font-semibold text-blue-300 mb-2'>Mobile e API:</h4><ul class='list-disc list-inside space-y-2'><li>Testes manuais completos em apps Android e iOS — funcionais, de layout, usabilidade e stress, cobrindo os casos que só aparecem depois que o usuário reclama.</li><li>Análise de requisitos e escrita de cenários em <strong>Gherkin</strong> (BDD) antes da execução, alinhando o time sobre o que estava sendo validado.</li><li>Testes de API REST com <strong>Postman</strong> e <strong>Swagger</strong>, com validações diretas no banco (<strong>SQL</strong> / <strong>DB2</strong>) quando necessário.</li><li>Gestão do ciclo de bugs no <strong>Jira</strong> do início ao fim, com feedback detalhado ao time de desenvolvimento até a confirmação da correção.</li><li>Simulações de teste em ambientes de homologação, pré-produção e produção, com evidências documentadas para análise.</li></ul><h4 class='text-lg font-semibold text-blue-300 mt-4 mb-2'>Plataforma Salesforce:</h4><ul class='list-disc list-inside space-y-2'><li>Levantamento de escopo, especificação de ambiente e validação de objetos, campos e regras de negócio na plataforma <strong>Salesforce</strong>.</li><li>Administração completa: criação de objetos, leads, contratos, campos e perfis de acesso.</li><li>Suporte contínuo em projetos de sustentação, com identificação de oportunidades de melhoria e criação de relatórios e dashboards para o time.</li></ul>",
        'proj_title': 'Projetos',
        'proj_subtitle': 'Automação de testes e qualidade de software.',
        'proj1_desc': 'Automação de testes de API com Cypress. Abordagem moderna e escalável.',
        'proj2_desc': 'Testes E2E com Cypress. Autenticação, formulários e cenários completos.',
        'proj3_desc': 'Sistema em Java para gestão de concessionária. CRUD completo com persistência de dados.',
        'proj4_desc': 'Testes avançados de UI em Java abordando Shadow DOM, iFrames e Ajax.',
        'proj5_desc': 'Automação com Robot Framework e Selenium. Keywords reutilizáveis e CI/CD.',
        'proj6_desc': 'Framework de automação com Playwright. Testes de API, E2E e visuais com POM e CI/CD.',
        'proj7_desc': 'Automação mobile em Android com Appium e Pytest. Page Object Model completo, do login ao checkout.',
        'proj_github': 'Ver no GitHub',
        'proj_filter_all': 'Todos',
        'proj_featured_badge': 'Projeto em destaque',
        'edu_title': 'Formação e Certificados',
        'edu_subtitle': 'Educação contínua em qualidade de software',
        'edu_academic_title': 'Formação Acadêmica',
        'edu_mba_status': 'Em andamento',
        'edu_mba_name': 'MBA em Engenharia de Software',
        'edu_mba_date': 'Início: out de 2025 | Conclusão: mai de 2027',
        'edu_mba_modal_title': 'MBA em Engenharia de Software',
        'edu_mba_modal_details': 'Aprofundando conhecimentos em arquitetura de software, gestão de projetos ágeis e tecnologias emergentes. Este curso está me proporcionando uma visão sistêmica para projetar e implementar estratégias de qualidade que se alinham diretamente aos objetivos de negócio, garantindo a construção de software escalável e de alta performance.',
        'edu_grad_name': 'Análise e Desenvolvimento de Sistemas',
        'edu_grad_date': 'mar de 2022 - out de 2024',
        'edu_grad_modal_title': 'Análise e Desenvolvimento de Sistemas',
        'edu_grad_modal_details': 'Graduação em Análise e Desenvolvimento de Sistemas pela UNINOVE, onde adquiri uma base sólida em lógica de programação, banco de dados, desenvolvimento web e mobile, e análise de requisitos, preparando-me para atuar no ciclo completo de desenvolvimento de software.',
        'edu_certs_title': 'Certificados',
        'contact_title': 'Contato',
        'contact_subtitle': 'Aberto a oportunidades e discussões sobre tecnologia e qualidade de software.',
        'stat_1': 'Certificações',
        'stat_2': 'Empresas',
        'stat_3': 'Anos de Experiência',
        'stat_4': 'Frameworks de Automação',
        'terminal_header': 'bash — testes automatizados',
        'stats_title': 'Um retrato rápido',
        'stats_subtitle': 'Números da minha trajetória, e um exemplo de como é rodar uma suíte de testes no dia a dia.',
        'skill_manual_testing': 'Testes Manuais',
        'skill_e2e_automation': 'Automação E2E',
        'skill_api_testing': 'Testes de API',
        'skill_mobile_testing': 'Testes Mobile',
        'skill_continuous_regression': 'Regressão Contínua',
        'skill_integration_testing': 'Testes de Integração',
        'skill_test_architecture': 'Arquitetura de Testes',
        'skill_performance_testing': 'Testes de Performance',
        'skill_relational_db': 'Banco de Dados Relacionais',
        'skill_databases': 'Banco de Dados',
        'skill_functional_testing': 'Testes Funcionais',
        'skill_manual_qa': 'QA Manual',
        'skill_regression_testing': 'Testes de Regressão',
        'skill_cnab_validation': 'Validação CNAB',
        'skill_qa_dashboards': 'Dashboards QA',
        'skill_e2e_testing': 'Testes E2E',
        'skill_oop': 'POO'
    },
    'en': {
        // Header Menu
        'nav_about': 'About',
        'nav_skills': 'Skills',
        'nav_experience': 'Experience',
        'nav_projects': 'Projects',
        'nav_education': 'Education',
        'nav_contact': 'Contact',
        
        // Hero Section
        'hero_desc': '6+ years ensuring software quality through manual testing and E2E, API, and Mobile test automation.',
        'hero_cta_projects': 'View Projects',
        'hero_cta_cv': 'Download CV',
        'hero_cta_contact': 'Contact',
        
        // Mobile Menu Text
        'mobile_lang_text': 'Change to Português',

        // Page translations (Full Page)
        'about_card_desc': "Finding what breaks before the user does",
        'about_title': 'About Me',
        'about_p1': "I've worked in software quality for over 6 years, across fintech, consulting, and product companies. Along the way I've tested a bit of everything — front-end, APIs, databases, mobile apps, Salesforce integrations, and even bank file formats like CNAB — always adapting to what the product and team need at the time.",
        'about_p2': "I like automating what's actually worth automating, but I know a good part of QA work happens outside the tooling: understanding the requirement well, asking questions early, and covering the cases nobody thought of. I'm currently pursuing an MBA in Software Engineering at USP/Esalq to better understand the side of the table that decides what gets built.",
        'about_p3': "Outside of work, I play guitar, game a fair amount, and ride my bike.",
        'skills_title': 'Core Competencies',
        'skills_cat1': 'Testing & QA',
        'skills_cat2': 'Tools',
        'skills_cat3': 'Methodologies & Languages',
        'exp_title': 'Professional Experience',
        'exp_subtitle': '6+ years working in software quality',
        'exp_current': 'Current',
        'exp_obj_time': 'Jun 2026 - Present',
        'exp_obj_role': 'QA Test Analyst',
        'exp_obj_loc': 'Objective · Remote',
        'exp_obj_b1': '• Manual functional and exploratory front-end testing, validating flow, usability, and visual consistency',
        'exp_obj_b2': '• API testing to validate contracts, responses, and service integrity',
        'exp_obj_b3': '• Database checks to ensure consistency between the application and persisted data',
        'exp_obj_b4': '• Monitoring production applications with Datadog for failure diagnosis',
        'exp_obj_modal_title': 'QA Test Analyst at Objective',
        'exp_obj_modal_details': "<h4 class='text-lg font-semibold text-blue-300 mb-2'>Manual front-end testing:</h4><ul class='list-disc list-inside space-y-2'><li>Manual functional and exploratory front-end testing, covering flow, usability, responsiveness, and visual consistency before every release.</li><li>API validation — contract, response, and data integrity behind the screen.</li><li>Database checks when what's shown on screen doesn't match what should be persisted.</li><li>Requirements gathering with the team to understand expected behavior before designing test cases.</li></ul><h4 class='text-lg font-semibold text-blue-300 mt-4 mb-2'>Observability & collaboration:</h4><ul class='list-disc list-inside space-y-2'><li>Monitoring and investigating application behavior in production with <strong>Datadog</strong>, tracing the root cause of failures before they become bigger problems.</li><li>Direct contact with the development team throughout the cycle, resolving most issues in conversation rather than only through formal bug reports.</li></ul>",
        'exp_finnet_time': 'Apr 2024 - Jun 2026',
        'exp_finnet_role': 'QA Test Analyst',
        'exp_finnet_loc': 'Finnet · Hybrid',
        'exp_finnet_b1': '• Manual testing of custom map products (CNAB), with documented test plans and scenarios',
        'exp_finnet_b2': '• API testing with Postman and regression automation in Cypress (BDD)',
        'exp_finnet_b3': '• Bug lifecycle management in Jira and sprint-level quality metrics tracking',
        'exp_finnet_b4': '• Isolated test environments with Docker and version control via GitLab',
        'exp_finnet_modal_title': 'QA Test Analyst at Finnet',
        'exp_finnet_modal_details': "<h4 class='text-lg font-semibold text-blue-300 mb-2'>Manual testing & quality:</h4><ul class='list-disc list-inside space-y-2'><li>Manual testing of custom map files in the <strong>CNAB</strong> standard — meticulous validation, since any error would keep the bank from processing the file.</li><li>Drafting test plans and specifying complex scenarios, with structured evidence documentation to ensure traceability of validations.</li><li>Defining and tracking quality metrics sprint over sprint, actively participating in Scrum ceremonies.</li><li>Managing the bug lifecycle in <strong>Jira</strong>, from report to confirmed fix with the responsible team.</li></ul><h4 class='text-lg font-semibold text-blue-300 mt-4 mb-2'>Automation & tools:</h4><ul class='list-disc list-inside space-y-2'><li>API integration testing with <strong>Postman</strong> before every release.</li><li>Automating part of the regression suite in <strong>Cypress</strong> with <strong>BDD</strong>, standardizing tests throughout the development cycle and catching breaks before they became incidents.</li><li>Isolated, reproducible test environments with <strong>Docker</strong>, with version control and continuous integration via <strong>GitLab</strong>.</li></ul>",
        'exp_fr_time': 'Feb 2020 - Feb 2024',
        'exp_fr_role': 'Mid-level QA Analyst',
        'exp_fr_loc': 'FR Consulting · Remote',
        'exp_fr_b1': '• Manual functional, layout, and stress testing on Mobile apps (Android/iOS) and Salesforce validations',
        'exp_fr_b2': '• BDD scenarios, API testing (Postman/Swagger), and SQL/DB2 queries for data validation',
        'exp_fr_b3': '• Bug lifecycle management in Jira and testing simulations in staging and production environments',
        'exp_fr_b4': '• Salesforce administration and quality dashboard creation',
        'exp_fr_modal_title': 'Mid-level QA Analyst at FR Consulting',
        'exp_fr_modal_details': "<h4 class='text-lg font-semibold text-blue-300 mb-2'>Mobile & API:</h4><ul class='list-disc list-inside space-y-2'><li>Full manual testing on Android and iOS apps — functional, layout, usability, and stress, covering the edge cases that only show up after users complain.</li><li>Requirements analysis and writing <strong>Gherkin</strong> (BDD) scenarios before execution, aligning the team on what was being validated.</li><li>REST API testing with <strong>Postman</strong> and <strong>Swagger</strong>, with direct database validation (<strong>SQL</strong> / <strong>DB2</strong>) when needed.</li><li>End-to-end bug lifecycle management in <strong>Jira</strong>, with detailed feedback to the development team through fix confirmation.</li><li>Test simulations across staging, pre-production, and production environments, with documented evidence for analysis.</li></ul><h4 class='text-lg font-semibold text-blue-300 mt-4 mb-2'>Salesforce Platform:</h4><ul class='list-disc list-inside space-y-2'><li>Scope gathering, environment specification, and validation of objects, fields, and business rules on the <strong>Salesforce</strong> platform.</li><li>Full administration: creating objects, leads, contracts, fields, and access profiles.</li><li>Ongoing support on maintenance projects, identifying improvement opportunities and building reports and dashboards for the team.</li></ul>",
        'proj_title': 'Projects',
        'proj_subtitle': 'Test automation and software quality.',
        'proj1_desc': 'API test automation with Cypress. Modern and scalable approach.',
        'proj2_desc': 'E2E testing with Cypress. Authentication, forms, and complete scenarios.',
        'proj3_desc': 'Dealership management system in Java. Full CRUD with data persistence.',
        'proj4_desc': 'Advanced UI testing in Java covering Shadow DOM, iFrames, and Ajax.',
        'proj5_desc': 'Automation with Robot Framework and Selenium. Reusable keywords and CI/CD.',
        'proj6_desc': 'Automation framework with Playwright. API, E2E, and visual testing with POM and CI/CD.',
        'proj7_desc': 'Android mobile automation with Appium and Pytest. Full Page Object Model, from login to checkout.',
        'proj_github': 'View on GitHub',
        'proj_filter_all': 'All',
        'proj_featured_badge': 'Featured project',
        'edu_title': 'Education & Certifications',
        'edu_subtitle': 'Continuous education in software quality',
        'edu_academic_title': 'Academic Background',
        'edu_mba_status': 'In progress',
        'edu_mba_name': 'MBA in Software Engineering',
        'edu_mba_date': 'Start: Oct 2025 | Completion: May 2027',
        'edu_mba_modal_title': 'MBA in Software Engineering',
        'edu_mba_modal_details': 'Deepening knowledge in software architecture, agile project management, and emerging technologies. This course is providing me with a systemic view to design and implement quality strategies that align directly with business goals, ensuring the construction of scalable and high-performance software.',
        'edu_grad_name': 'Systems Analysis and Development',
        'edu_grad_date': 'Mar 2022 - Oct 2024',
        'edu_grad_modal_title': 'Systems Analysis and Development',
        'edu_grad_modal_details': 'Degree in Systems Analysis and Development from UNINOVE, where I acquired a solid foundation in programming logic, databases, web and mobile development, and requirements analysis, preparing me to work across the full software development lifecycle.',
        'edu_certs_title': 'Certifications',
        'contact_title': 'Contact',
        'contact_subtitle': 'Open to opportunities and discussions about technology and software quality.',
        'stat_1': 'Certifications',
        'stat_2': 'Companies',
        'stat_3': 'Years of Experience',
        'stat_4': 'Automation Frameworks',
        'terminal_header': 'bash — automated tests',
        'stats_title': 'A quick snapshot',
        'stats_subtitle': 'Numbers from my career, and an example of what running a test suite looks like day to day.',
        'skill_manual_testing': 'Manual Testing',
        'skill_e2e_automation': 'E2E Automation',
        'skill_api_testing': 'API Testing',
        'skill_mobile_testing': 'Mobile Testing',
        'skill_continuous_regression': 'Continuous Regression',
        'skill_integration_testing': 'Integration Testing',
        'skill_test_architecture': 'Test Architecture',
        'skill_performance_testing': 'Performance Testing',
        'skill_relational_db': 'Relational Databases',
        'skill_databases': 'Databases',
        'skill_functional_testing': 'Functional Testing',
        'skill_manual_qa': 'Manual QA',
        'skill_regression_testing': 'Regression Testing',
        'skill_cnab_validation': 'CNAB Validation',
        'skill_qa_dashboards': 'QA Dashboards',
        'skill_e2e_testing': 'E2E Testing',
        'skill_oop': 'OOP'
    }
};

function getInitialLanguage() {
    const savedLang = localStorage.getItem('lang');
    if (savedLang === 'pt' || savedLang === 'en') return savedLang;
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

let currentLang = getInitialLanguage();

const MONTH_PT_TO_EN = {
    jan: 'Jan', fev: 'Feb', mar: 'Mar', abr: 'Apr',
    mai: 'May', jun: 'Jun', jul: 'Jul', ago: 'Aug',
    set: 'Sep', out: 'Oct', nov: 'Nov', dez: 'Dec'
};

// Datas dos certificados ("mar de 2024") são texto solto, não vêm do
// dicionário de chaves — traduzimos o mês na hora em vez de cadastrar
// uma chave pra cada um dos 22 certificados.
function translateCertDate(text, lang) {
    if (lang !== 'en') return text;
    return text.replace(/\b(jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez)\s+de\s+(\d{4})/i, (_, mon, year) => {
        return `${MONTH_PT_TO_EN[mon.toLowerCase()]} ${year}`;
    });
}

// Nomes dos 22 certificados: são o título exibido no site, não o nome
// oficial gravado no certificado em si, então traduzir aqui não altera
// a credencial real — só ajuda quem lê em inglês a entender do que se trata.
const CERT_TITLE_PT_TO_EN = {
    'Playwright eXpress': 'Playwright eXpress',
    'Minicurso de Java': 'Java Mini-course',
    'C++: Conhecendo a linguagem e a STL': 'C++: Getting to Know the Language and the STL',
    'Getting Started with Git and GitHub': 'Getting Started with Git and GitHub',
    'JavaScript Full Stack Capstone Project': 'JavaScript Full Stack Capstone Project',
    'CSS: Flexbox e layouts responsivos': 'CSS: Flexbox and Responsive Layouts',
    'HTML e CSS: estrutura de arquivos e tags': 'HTML and CSS: File Structure and Tags',
    'JavaScript: explorando a linguagem': 'JavaScript: Exploring the Language',
    'Cypress: automação de testes E2E': 'Cypress: E2E Test Automation',
    'Quality Assurance: plano de testes e gestão de bugs': 'Quality Assurance: Test Planning and Bug Management',
    'Cypress eXpress': 'Cypress eXpress',
    'Introdução à Programação Orientada a Objeto': 'Introduction to Object-Oriented Programming',
    'Jira Software - Gestão Ágil de Projetos': 'Jira Software - Agile Project Management',
    'Testes funcionais com Selenium WebDriver': 'Functional Testing with Selenium WebDriver',
    'Java Programmer - Módulo 2 e 3': 'Java Programmer - Modules 2 and 3',
    'Java Programmer - Módulo 1': 'Java Programmer - Module 1',
    'Lógica de Programação aplicada à Linguagem': 'Programming Logic Applied to the Language',
    'Scrum - Gestão e Desenvolvimento Ágil': 'Scrum - Agile Management and Development',
    'Introdução à Lógica de Programação': 'Introduction to Programming Logic',
    'Kanban: O Guia Completo': 'Kanban: The Complete Guide',
    'Algoritmos e Lógica de Programação': 'Algorithms and Programming Logic',
    'Administrador de Salesforce': 'Salesforce Administrator'
};

function translateCertTitle(text, lang) {
    if (lang !== 'en') return text;
    return CERT_TITLE_PT_TO_EN[text] || text;
}

function updateLanguage(lang) {
    currentLang = lang;
    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-br' : 'en');
    resetTypingEffect();
    resetTerminal();

    document.querySelectorAll('#certificates-grid .academic-card p').forEach(p => {
        if (!p.dataset.originalPt) p.dataset.originalPt = p.textContent;
        p.textContent = translateCertDate(p.dataset.originalPt, lang);
    });
    document.querySelectorAll('#certificates-grid .academic-card').forEach(card => {
        const h4 = card.querySelector('h4');
        if (!h4) return;
        if (!h4.dataset.originalPt) h4.dataset.originalPt = h4.textContent;
        const translatedTitle = translateCertTitle(h4.dataset.originalPt, lang);
        h4.textContent = translatedTitle;
        // O clique no card abre o modal usando data-title, não o texto do h4
        card.dataset.title = translatedTitle;
    });

    // Atualiza os textos no HTML baseados no data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (i18nDictionary[lang][key]) {
            element.textContent = i18nDictionary[lang][key];
        }
    });

    // Atualiza os modais das Experiências e Formação
    document.querySelectorAll('[data-i18n-title]').forEach(element => {
        const key = element.getAttribute('data-i18n-title');
        if (i18nDictionary[lang][key]) {
            element.setAttribute('data-title', i18nDictionary[lang][key]);
        }
    });
    document.querySelectorAll('[data-i18n-details]').forEach(element => {
        const key = element.getAttribute('data-i18n-details');
        if (i18nDictionary[lang][key]) {
            element.setAttribute('data-details', i18nDictionary[lang][key]);
        }
    });
    
    // Atualiza Bandeiras e Textos Específicos
    const flag = lang === 'pt' ? '🇧🇷' : '🇺🇸';
    
    const flagIconDesktop = document.getElementById('lang-flag');
    const flagIconMobile = document.getElementById('lang-flag-mobile');
    const langTextMobile = document.getElementById('lang-text-mobile');
    
    if (flagIconDesktop) flagIconDesktop.textContent = flag;
    if (flagIconMobile) flagIconMobile.textContent = flag;
    if (langTextMobile) langTextMobile.textContent = i18nDictionary[lang]['mobile_lang_text'];
}

function toggleLanguage() {
    const newLang = currentLang === 'pt' ? 'en' : 'pt';
    localStorage.setItem('lang', newLang);
    updateLanguage(newLang);
}

const langToggleBtn = document.getElementById('lang-toggle');
const langToggleMobileBtn = document.getElementById('lang-toggle-mobile');
if (langToggleBtn) langToggleBtn.addEventListener('click', toggleLanguage);
if (langToggleMobileBtn) langToggleMobileBtn.addEventListener('click', toggleLanguage);

// Aplica o idioma salvo na inicialização
document.addEventListener('DOMContentLoaded', () => {
    updateLanguage(currentLang);
});
