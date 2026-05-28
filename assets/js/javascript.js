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
document.querySelectorAll('header a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Previne o salto imediato padrão

        const targetId = this.getAttribute('href');
        
        // O link "Contato" do topo tem href="#contato", assim como o da seção Hero.
        // O link "Home" (Logo) tem href="#home".
        if (targetId) {
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
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

    window.addEventListener('scroll', handleScroll);

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

        detailsModal.classList.add('qa-mode'); // Ativa o fundo de letras QA

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
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// --- Criação de Partículas Abstratas de Fundo ---
let particlesContainer;

function createAbstractParticles() {
    if (!particlesContainer) return;
    
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle abstract-particle';
        
        const size = Math.random() * 8 + 4;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.left = Math.random() * 100 + 'vw';
        
        const duration = Math.random() * 15 + 15;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `-${Math.random() * 30}s`;
        
        particlesContainer.appendChild(particle);
    }
}

function initParticleSystem() {
    if (window.innerWidth > 768) {
        particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.body.appendChild(particlesContainer);
        
        createAbstractParticles();
    }
}

// ===== Efeito de Digitação Animado (Typing) =====
const typingText = document.getElementById('typing-text');
const typingRoles = [
    'Engenheiro de Automação',
    'Automação com Selenium',
    'Automação com Cypress',
    'Automação com Robot Framework',
    'Arquitetura de Testes & CI/CD',
    'Testes E2E & API'
];
let roleIndex = 0;
let charIndex = 0;
let isDeletingRole = false;

function initTypingEffect() {
    if (!typingText) return;
    const currentRole = typingRoles[roleIndex];
    
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
        roleIndex = (roleIndex + 1) % typingRoles.length;
        typeSpeed = 500; // Pausa curta antes de começar a nova palavra
    }
    setTimeout(initTypingEffect, typeSpeed);
}
setTimeout(initTypingEffect, 1000);

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

    modal.classList.remove('qa-mode'); // Remove letras QA

    // Detecta o tema dinâmico baseado na stack e aplica no Modal
    const theme = getThemeForProject(project.technologies);
    modal.style.setProperty('--dynamic-color', theme.color);
    modal.style.setProperty('--dynamic-color-rgb', theme.rgb);

    // Prepara o elemento HTML da imagem de fundo
    const watermarkHtml = theme.logo ? `<img src="${theme.logo}" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-[0.03] dark:opacity-[0.08] pointer-events-none z-0" alt="Watermark">` : '';

    const lang = getInitialLanguage();
    // Puxa do dicionário se necessário, garantindo fallback elegante para o PT-BR
    const techText = lang === 'en' ? 'Technologies Used' : 'Tecnologias Utilizadas';
    const featuresText = lang === 'en' ? 'Features' : 'Funcionalidades';
    const btnText = lang === 'en' ? 'View on GitHub' : 'Ver no GitHub';

    // Bug Fix: Puxa diretamente os textos do projeto (que já estão em português)
    const desc = project.description;
    const feats = project.features;

    // Adiciona o título com um pequeno detalhe visual cyber (✦) puxando a cor da stack
    modalTitle.innerHTML = `<span class="dynamic-text mr-2 opacity-80">✦</span>${project.title}`;
    
    modalBody.innerHTML = `
        ${watermarkHtml}
        
        <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--dynamic-color)] to-transparent opacity-60"></div>
        
        <div class="relative z-10 pt-2 flex flex-col min-h-full">
            <p class="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">${desc}</p>
            
            <div class="mt-8">
                <h4 class="text-xs uppercase tracking-[0.2em] font-bold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                    <svg class="w-4 h-4 dynamic-text" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>
                    ${techText}
                </h4>
                <div class="flex flex-wrap gap-2">
                    ${project.technologies.map(tech => `<span class="px-4 py-1.5 dynamic-badge rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 cursor-default">${tech}</span>`).join('')}
                </div>
            </div>
            
            <div class="mt-8">
                <h4 class="text-xs uppercase tracking-[0.2em] font-bold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                    <svg class="w-4 h-4 dynamic-text" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                    ${featuresText}
                </h4>
                <ul class="space-y-3">
                    ${feats.map(feature => `
                        <li class="flex items-start gap-3 p-4 rounded-xl bg-white/40 dark:bg-gray-800/40 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm transition-all duration-300 group">
                            <span class="dynamic-text mt-1 shrink-0 group-hover:scale-110 transition-transform">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </span>
                            <span class="text-gray-800 dark:text-gray-300 font-medium">${feature}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="mt-auto pt-10 flex justify-end">
                <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-8 py-3 dynamic-btn rounded-xl font-bold tracking-wide group">
                    <span>${btnText}</span>
                    <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg>
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
    });
});

function closeModal() {
    const modal = document.getElementById('details-modal');
    modal.classList.add('opacity-0');
    modal.querySelector('#modal-content').classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// ===== Simulador de Terminal (Pipeline QA) =====
const terminalOutput = document.getElementById('terminal-output');
const terminalLogs = [
    { type: 'cmd', text: '$ npm run cy:e2e-suite' },
    { type: 'info', text: '> Inicializando Cypress Test Runner...' },
    { type: 'info', text: '> Iniciando navegador headless (Electron 114)...' },
    { type: 'success', text: '✓ [PASS] Fluxo de Autenticação de Usuário (1.2s)' },
    { type: 'success', text: '✓ [PASS] Integração com Gateway de Pagamento (2.4s)' },
    { type: 'error', text: '✗ [FAIL] Timeout na Resposta da API Mock (5.0s)' },
    { type: 'info', text: '> Retentando teste falho 1/2...' },
    { type: 'success', text: '✓ [PASS] Resposta da API Mock [RETRY SUCESSO] (1.1s)' },
    { type: 'info', text: '> Gerando Relatório HTML com Mochawesome...' },
    { type: 'success', text: '✨ Todos os 142 testes passaram com sucesso!' },
    { type: 'cmd', text: '$ echo "Pronto para Deploy 🚀"' }
];
let logIndex = 0;
let terminalStarted = false;
const terminalObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !terminalStarted) {
        terminalStarted = true;
        printTerminalLog();
    }
}, { threshold: 0.5 });
if (terminalOutput) terminalObserver.observe(terminalOutput);
function printTerminalLog() {
    if (logIndex >= terminalLogs.length) {
        // Adiciona um cursor de bash piscando ao final da execução
        const cursorLine = document.createElement('div');
        cursorLine.className = 'log-line log-cmd mt-2';
        cursorLine.innerHTML = '<span class="typing-cursor" style="margin-left: 0; opacity: 0.7;"></span>';
        terminalOutput.appendChild(cursorLine);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
        return;
    }
    const log = terminalLogs[logIndex];
    const line = document.createElement('div');
    line.className = `log-line log-${log.type}`;
    line.textContent = log.text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
    logIndex++;
    const delay = log.type === 'cmd' ? 800 : (Math.random() * 400 + 100);
    setTimeout(printTerminalLog, delay);
}

// Inicia o sistema de gamificação em telas maiores
initParticleSystem();

// ===== Efeito de Cursor Glow =====
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
    cursorGlow.classList.add('active');
});

document.addEventListener('mouseleave', () => {
    cursorGlow.classList.remove('active');
});

// ===== Efeito de Tilt 3D nos Cards =====
const tiltCards = document.querySelectorAll('.project-card, .experience-card, .academic-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.setProperty('--rotate-x', `${-rotateX}deg`);
        card.style.setProperty('--rotate-y', `${rotateY}deg`);
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--rotate-x', '0deg');
        card.style.setProperty('--rotate-y', '0deg');
    });
});

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
    });
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
    if (!isSpyScrolling) {
        window.requestAnimationFrame(() => {
            let current = '';
            // Descobre qual seção está na tela
            sectionsSpy.forEach(section => {
                const sectionTop = section.offsetTop;
                if (scrollY >= (sectionTop - 250)) { // 250px de margem pelo header
                    current = section.getAttribute('id');
                }
            });

            // Atualiza os links do menu com classes do Tailwind
            navLinks.forEach(link => {
                // Garante que o estado padrão "desativado" sempre retorne
                link.classList.remove('text-blue-600', 'dark:text-blue-400', 'bg-blue-50', 'dark:bg-blue-900/30');
                link.classList.add('text-gray-600', 'dark:text-gray-300');
                
                // Adiciona o destaque somente na seção atual
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.remove('text-gray-600', 'dark:text-gray-300');
                    link.classList.add('text-blue-600', 'dark:text-blue-400', 'bg-blue-50', 'dark:bg-blue-900/30');
                }
            });
            isSpyScrolling = false;
        });
        isSpyScrolling = true;
    }
});

// --- Lógica do Botão "Ver Mais" nos Certificados ---
const certificatesGrid = document.getElementById('certificates-grid');
const toggleCertsBtn = document.getElementById('toggle-certs-btn');
const toggleCertsContainer = document.getElementById('cert-toggle-container');
const toggleCertsText = document.getElementById('toggle-certs-text');
const toggleCertsIcon = document.getElementById('toggle-certs-icon');

const INITIAL_CERTS_COUNT = 6;
let isShowingAllCerts = false;

if (certificatesGrid && toggleCertsBtn && toggleCertsContainer) {
    // Pega todos os cards mas exclui a "Formação Acadêmica" (pegamos apenas os da div de certificados)
    const certCards = Array.from(certificatesGrid.querySelectorAll('.academic-card'));
    
    if (certCards.length > INITIAL_CERTS_COUNT) {
        toggleCertsContainer.classList.remove('hidden');
        
        // Esconde os adicionais na carga inicial
        certCards.forEach((card, index) => {
            if (index >= INITIAL_CERTS_COUNT) {
                card.classList.add('hidden', 'opacity-0');
                card.classList.add('transition-opacity', 'duration-500'); // Garante a transição suave
            }
        });

        toggleCertsText.textContent = `Ver todos os ${certCards.length} certificados`;

        toggleCertsBtn.addEventListener('click', () => {
            const currentLang = getInitialLanguage();
            
            isShowingAllCerts = !isShowingAllCerts;
            
            if (isShowingAllCerts) {
                // Mostrar todos com efeito cascata
                certCards.forEach((card, index) => {
                    if (index >= INITIAL_CERTS_COUNT) {
                        card.classList.remove('hidden');
                        // Timeout curto gera o efeito cascata legal
                        setTimeout(() => {
                            card.classList.remove('opacity-0');
                        }, 50 * (index - INITIAL_CERTS_COUNT));
                    }
                });
                toggleCertsText.setAttribute('data-i18n', 'cert_btn_hide');
                toggleCertsText.textContent = i18nDictionary[currentLang]['cert_btn_hide'];
                toggleCertsIcon.classList.add('rotate-180');
            } else {
                // Esconder adicionais
                certCards.forEach((card, index) => {
                    if (index >= INITIAL_CERTS_COUNT) {
                        card.classList.add('opacity-0');
                        setTimeout(() => { card.classList.add('hidden'); }, 300);
                    }
                });
                toggleCertsText.setAttribute('data-i18n', 'cert_btn_show');
                toggleCertsText.textContent = i18nDictionary[currentLang]['cert_btn_show'];
                toggleCertsIcon.classList.remove('rotate-180');
                
                // Rola de volta para evitar que a tela fique parada no meio do nada após encolher
                certificatesGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }
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
        'hero_role': 'Analista de Qualidade',
        'hero_desc': '6+ anos garantindo a qualidade de software através de testes manuais e automação de testes E2E, API e Mobile.',
        'hero_cta_projects': 'Ver Projetos',
        'hero_cta_cv': 'Baixar CV',
        'hero_cta_contact': 'Contato',
        
        // Mobile Menu Text
        'mobile_lang_text': 'Mudar para English',

        // Page translations (Full Page)
        'about_card_desc': 'Garantindo excelência em cada entrega',
        'about_title': 'Sobre Mim',
        'about_p1': 'Atuo há mais de 6 anos na área de Quality Assurance, com foco em elevar o padrão de entrega de software através de automação inteligente e processos ágeis. Tenho experiência sólida na construção de cenários E2E, validação de APIs e testes Mobile, buscando sempre a máxima confiabilidade do produto.',
        'about_p2': 'Para mim, qualidade não é apenas encontrar bugs no final, mas prevenir falhas desde a concepção do projeto. Por isso, valorizo a colaboração contínua com desenvolvedores, product owners e designers para construir soluções que realmente agreguem valor aos usuários.',
        'about_p3': 'Fora do ambiente corporativo, sou entusiasta de videogames, música (guitarra e violão) e ciclismo. Acredito que cultivar esses hobbies é essencial para manter o foco, a criatividade e a capacidade de resolução de problemas sempre em alta.',
        'skills_title': 'Principais Competências',
        'skills_cat1': 'Testes e QA',
        'skills_cat2': 'Ferramentas',
        'skills_cat3': 'Metodologias e Linguagens',
        'exp_title': 'Experiência Profissional',
        'exp_subtitle': '6+ anos atuando em qualidade de software',
        'exp_current': 'Atual',
        'exp_finnet_time': 'abr de 2024 - o momento',
        'exp_finnet_role': 'Analista de Testes',
        'exp_finnet_loc': 'Finnet · Híbrida',
        'exp_finnet_b1': 'Forte atuação na execução de testes manuais, exploratórios e de regressão em produtos de mapas customizados (CNAB).',
        'exp_finnet_b2': 'Escrita de cenários em BDD (Gherkin), documentação de evidências, métricas de qualidade e tracking de bugs no Jira.',
        'exp_finnet_b3': 'Automação de testes E2E com Cypress e validação da integração de APIs REST utilizando Postman.',
        'exp_finnet_b4': 'Integração contínua das suítes de teste em pipelines CI/CD via GitLab, com provisionamento de ambientes QA em Docker.',
        'exp_finnet_modal_title': 'Analista de Testes na Finnet',
        'exp_finnet_modal_details': "<h4 class='text-lg font-semibold text-blue-300 mb-2'>Testes Manuais e Qualidade:</h4><ul class='list-disc list-inside space-y-2'><li>Forte atuação na execução de testes manuais funcionais e exploratórios em produtos de mapas customizados (padrão CNAB).</li><li>Elaboração de planos de teste, especificação de cenários complexos e documentação estruturada de evidências para garantir a rastreabilidade das validações.</li><li>Abertura, triagem e acompanhamento ponta a ponta do ciclo de vida de bugs no <strong>Jira</strong>, validando as correções desde o reporte até a resolução final.</li><li>Definição e monitoramento de métricas de qualidade alinhadas às Sprints, com participação ativa nas cerimônias Scrum.</li></ul><h4 class='text-lg font-semibold text-blue-300 mt-4 mb-2'>Automação e Ferramentas:</h4><ul class='list-disc list-inside space-y-2'><li>Execução de testes de API com <strong>Postman</strong> para validar a comunicação e a integridade dos serviços.</li><li>Desenvolvimento e manutenção de testes automatizados E2E com <strong>Cypress</strong> (BDD), focados em otimizar as suítes de regressão.</li><li>Gerenciamento de ambientes de teste isolados com <strong>Docker</strong> e controle de versão de testes utilizando <strong>GitLab</strong>.</li></ul>",
        'exp_fr_time': 'fev de 2020 - fev de 2024',
        'exp_fr_role': 'Analista de Qualidade Pleno',
        'exp_fr_loc': 'FR Consulting · Remota',
        'exp_fr_b1': 'Condução de testes funcionais, exploratórios e de usabilidade em aplicações Mobile (Android/iOS) e na plataforma Salesforce.',
        'exp_fr_b2': 'Especificação de cenários BDD, homologação de requisitos, documentação de evidências e gestão do ciclo de bugs no Jira.',
        'exp_fr_b3': 'Validação robusta de backend através de testes de serviços com Postman/Swagger e desenvolvimento de queries SQL e DB2.',
        'exp_fr_b4': 'Criação de dashboards de qualidade e suporte técnico na administração de ambientes QA no ecossistema Salesforce.',
        'exp_fr_modal_title': 'Analista de Qualidade Pleno na FR Consulting',
        'exp_fr_modal_details': "<h4 class='text-lg font-semibold text-blue-300 mb-2'>Testes Mobile e API:</h4><ul class='list-disc list-inside space-y-2'><li>Condução de ciclos completos de testes manuais e funcionais em aplicativos móveis (Android e iOS), cobrindo usabilidade, layout e stress.</li><li>Especificação de cenários de teste utilizando <strong>Gherkin</strong> (BDD), com foco na documentação de evidências claras e estruturadas.</li><li>Identificação, abertura e acompanhamento de bugs no <strong>Jira</strong>, interagindo com os desenvolvedores até a confirmação da correção.</li><li>Execução de testes de API REST com <strong>Postman</strong> e <strong>Swagger</strong>.</li><li>Desenvolvimento de consultas em <strong>SQL</strong> e <strong>DB2</strong> para realizar validações de dados complexas e garantir a consistência da base.</li></ul><h4 class='text-lg font-semibold text-blue-300 mt-4 mb-2'>Plataforma Salesforce:</h4><ul class='list-disc list-inside space-y-2'><li>Levantamento de escopo, especificação de ambiente e validação de objetos e customizações na plataforma <strong>Salesforce</strong>.</li><li>Administração completa: criação de objetos, leads, contratos, campos, perfis de acesso e parametrizações do sistema.</li><li>Atuação em projetos de sustentação, suporte contínuo e geração de relatórios/dashboards para análise de dados.</li></ul>",
        'proj_title': 'Projetos',
        'proj_subtitle': 'Automação de testes e qualidade de software.',
        'proj1_desc': 'Automação de testes de API com Cypress. Abordagem moderna e escalável.',
        'proj2_desc': 'Testes E2E com Cypress. Autenticação, formulários e cenários completos.',
        'proj3_desc': 'Sistema em Java para gestão de concessionária. CRUD completo com persistência de dados.',
        'proj4_desc': 'Testes avançados de UI em Java abordando Shadow DOM, iFrames e Ajax.',
        'proj5_desc': 'Automação com Robot Framework e Selenium. Keywords reutilizáveis e CI/CD.',
        'proj_github': 'Ver no GitHub',
        'edu_title': 'Formação e Certificados',
        'edu_subtitle': 'Educação contínua em qualidade de software',
        'edu_academic_title': 'Formação Acadêmica',
        'edu_mba_status': 'Previsto',
        'edu_mba_name': 'MBA em Engenharia de Software',
        'edu_mba_date': 'Início: out de 2025 | Conclusão: mai de 2027',
        'edu_mba_modal_title': 'MBA em Engenharia de Software',
        'edu_mba_modal_details': 'Aprofundando conhecimentos em arquitetura de software, gestão de projetos ágeis e tecnologias emergentes. Este curso está me proporcionando uma visão sistêmica para projetar e implementar estratégias de qualidade que se alinham diretamente aos objetivos de negócio, garantindo a construção de software escalável e de alta performance.',
        'edu_grad_name': 'Análise e Desenvolvimento de Sistemas',
        'edu_grad_date': 'mar de 2022 - out de 2024',
        'edu_grad_modal_title': 'Análise e Desenvolvimento de Sistemas',
        'edu_grad_modal_details': 'Graduação em Análise e Desenvolvimento de Sistemas pela UNINOVE, onde adquiri uma base sólida em lógica de programação, banco de dados, desenvolvimento web e mobile, e análise de requisitos, preparando-me para atuar no ciclo completo de desenvolvimento de software.',
        'edu_certs_title': 'Certificados',
        'cert_btn_show': 'Ver todos os 21 certificados',
        'cert_btn_hide': 'Ver menos',
        'contact_title': 'Contato',
        'contact_subtitle': 'Aberto a oportunidades e discussões sobre tecnologia e qualidade de software.',
        'stat_1': 'Testes Automatizados',
        'stat_2': 'Cenários Mapeados',
        'stat_3': 'Anos de Experiência',
        'stat_4': 'Qualidade Garantida',
        'footer_text': 'Criado com HTML, Tailwind CSS e ❤️'
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
        'hero_role': 'Quality Assurance Analyst',
        'hero_desc': '6+ years ensuring software quality through manual testing and E2E, API, and Mobile test automation.',
        'hero_cta_projects': 'View Projects',
        'hero_cta_cv': 'Download CV',
        'hero_cta_contact': 'Contact',
        
        // Mobile Menu Text
        'mobile_lang_text': 'Change to Português',

        // Page translations (Full Page)
        'about_card_desc': 'Ensuring excellence in every delivery',
        'about_title': 'About Me',
        'about_p1': 'I have over 6 years of experience in Quality Assurance, focusing on raising the standard of software delivery through intelligent automation and agile processes. I have solid experience in building E2E scenarios, API validation, and Mobile testing, always striving for maximum product reliability.',
        'about_p2': 'For me, quality is not just finding bugs at the end, but preventing failures from the project\'s conception. That\'s why I value continuous collaboration with developers, product owners, and designers to build solutions that truly add value to users.',
        'about_p3': 'Outside the corporate environment, I am a video game enthusiast, musician (guitar and acoustic), and cyclist. I believe cultivating these hobbies is essential to keep focus, creativity, and problem-solving skills sharp.',
        'skills_title': 'Core Competencies',
        'skills_cat1': 'Testing & QA',
        'skills_cat2': 'Tools',
        'skills_cat3': 'Methodologies & Languages',
        'exp_title': 'Professional Experience',
        'exp_subtitle': '6+ years working in software quality',
        'exp_current': 'Present',
        'exp_finnet_time': 'Apr 2024 - Present',
        'exp_finnet_role': 'QA Tester',
        'exp_finnet_loc': 'Finnet · Hybrid',
        'exp_finnet_b1': 'Strong background executing manual, exploratory, and regression testing on custom map products (CNAB).',
        'exp_finnet_b2': 'BDD (Gherkin) scenario writing, evidence documentation, quality metrics, and bug tracking in Jira.',
        'exp_finnet_b3': 'E2E test automation with Cypress and REST API integration validation using Postman.',
        'exp_finnet_b4': 'Continuous integration of test suites into CI/CD pipelines via GitLab, provisioning QA environments with Docker.',
        'exp_finnet_modal_title': 'QA Tester at Finnet',
        'exp_finnet_modal_details': "<h4 class='text-lg font-semibold text-blue-300 mb-2'>Manual Testing & Quality:</h4><ul class='list-disc list-inside space-y-2'><li>Strong execution of functional and exploratory manual tests on custom map products (CNAB standard).</li><li>Drafting test plans, specifying complex scenarios, and structured documentation of evidence to ensure traceability.</li><li>Opening, triaging, and end-to-end tracking of bugs in <strong>Jira</strong>, validating fixes from report to final resolution.</li><li>Definition and monitoring of quality metrics aligned with Sprints, actively participating in Scrum ceremonies.</li></ul><h4 class='text-lg font-semibold text-blue-300 mt-4 mb-2'>Automation & Tools:</h4><ul class='list-disc list-inside space-y-2'><li>Execution of API tests with <strong>Postman</strong> to validate communication and service integrity.</li><li>Development and maintenance of automated E2E tests with <strong>Cypress</strong> (BDD), focused on optimizing regression suites.</li><li>Management of isolated test environments with <strong>Docker</strong> and test version control using <strong>GitLab</strong>.</li></ul>",
        'exp_fr_time': 'Feb 2020 - Feb 2024',
        'exp_fr_role': 'Mid-level QA Analyst',
        'exp_fr_loc': 'FR Consulting · Remote',
        'exp_fr_b1': 'Conducted functional, exploratory, and usability testing on Mobile apps (Android/iOS) and the Salesforce platform.',
        'exp_fr_b2': 'BDD scenario specification, requirements validation, evidence documentation, and bug lifecycle management in Jira.',
        'exp_fr_b3': 'Robust backend validation through service testing with Postman/Swagger and SQL/DB2 query development.',
        'exp_fr_b4': 'Creation of quality dashboards and technical support in QA environment administration within the Salesforce ecosystem.',
        'exp_fr_modal_title': 'Mid-level QA Analyst at FR Consulting',
        'exp_fr_modal_details': "<h4 class='text-lg font-semibold text-blue-300 mb-2'>Mobile & API Testing:</h4><ul class='list-disc list-inside space-y-2'><li>Conducted full manual and functional testing cycles on mobile apps (Android and iOS), covering usability, layout, and stress.</li><li>Specification of test scenarios using <strong>Gherkin</strong> (BDD), focusing on clear and structured evidence documentation.</li><li>Identification, reporting, and tracking of bugs in <strong>Jira</strong>, interacting with developers until fix confirmation.</li><li>Execution of REST API testing with <strong>Postman</strong> and <strong>Swagger</strong>.</li><li>Development of queries in <strong>SQL</strong> and <strong>DB2</strong> to perform complex data validations and ensure database consistency.</li></ul><h4 class='text-lg font-semibold text-blue-300 mt-4 mb-2'>Salesforce Platform:</h4><ul class='list-disc list-inside space-y-2'><li>Scope gathering, environment specification, and validation of objects and customizations on the <strong>Salesforce</strong> platform.</li><li>Complete administration: creation of objects, leads, contracts, fields, access profiles, and system parameterizations.</li><li>Worked on support projects, continuous maintenance, and generated reports/dashboards for data analysis.</li></ul>",
        'proj_title': 'Projects',
        'proj_subtitle': 'Test automation and software quality.',
        'proj1_desc': 'API test automation with Cypress. Modern and scalable approach.',
        'proj2_desc': 'E2E testing with Cypress. Authentication, forms, and complete scenarios.',
        'proj3_desc': 'Dealership management system in Java. Full CRUD with data persistence.',
        'proj4_desc': 'Advanced UI testing in Java covering Shadow DOM, iFrames, and Ajax.',
        'proj5_desc': 'Automation with Robot Framework and Selenium. Reusable keywords and CI/CD.',
        'proj_github': 'View on GitHub',
        'edu_title': 'Education & Certifications',
        'edu_subtitle': 'Continuous education in software quality',
        'edu_academic_title': 'Academic Background',
        'edu_mba_status': 'Expected',
        'edu_mba_name': 'MBA in Software Engineering',
        'edu_mba_date': 'Start: Oct 2025 | Completion: May 2027',
        'edu_mba_modal_title': 'MBA in Software Engineering',
        'edu_mba_modal_details': 'Deepening knowledge in software architecture, agile project management, and emerging technologies. This course is providing me with a systemic view to design and implement quality strategies that align directly with business goals, ensuring the construction of scalable and high-performance software.',
        'edu_grad_name': 'Systems Analysis and Development',
        'edu_grad_date': 'Mar 2022 - Oct 2024',
        'edu_grad_modal_title': 'Systems Analysis and Development',
        'edu_grad_modal_details': 'Degree in Systems Analysis and Development from UNINOVE, where I acquired a solid foundation in programming logic, databases, web and mobile development, and requirements analysis, preparing me to work across the full software development lifecycle.',
        'edu_certs_title': 'Certifications',
        'cert_btn_show': 'View all 21 certifications',
        'cert_btn_hide': 'Show less',
        'contact_title': 'Contact',
        'contact_subtitle': 'Open to opportunities and discussions about technology and software quality.',
        'stat_1': 'Automated Tests',
        'stat_2': 'Mapped Scenarios',
        'stat_3': 'Years of Experience',
        'stat_4': 'Quality Ensured',
        'footer_text': 'Created with HTML, Tailwind CSS and ❤️'
    }
};

function getInitialLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    return browserLang.toLowerCase().startsWith('pt') ? 'pt' : 'en';
}

let currentLang = getInitialLanguage();

function updateLanguage(lang) {
    currentLang = lang;
    
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

// Aplica o idioma salvo na inicialização
document.addEventListener('DOMContentLoaded', () => {
    updateLanguage(currentLang);
});
