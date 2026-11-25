/* ==========================================================================
   NILTON GOMES - LÓGICA E INTERATIVIDADE (APP.JS)
   ========================================================================== */

// DADOS CONFIGURÁVEIS DO PROFISSIONAL (Altere facilmente aqui)
const CONFIG = {
  nomeProfissional: "Nilton Gomes da Silva",
  subtitulo: "Construção Civil & Acabamentos de Alto Padrão",
  telefoneWhatsApp: "5519999084140", // 
  cidadeAtendimento: "Rio Claro - SP",
  email: "niltinho78@yahoo.com",
  endereco: "Rua do Sobrado, n°135 - Regina Picelli, Rio Claro/SP, 13505-220",
  anosExperiencia: "15+",
  obrasEntregues: "250+"
};

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCalculator();
  initPortfolioFilters();
  initLightbox();
  initFAQ();
  updateConfigurableTexts();
});

/* ==========================================
   1. NAVBAR SCROLL & MENU MOBILE
   ========================================== */
function initNavbar() {
  const navbar = document.querySelector('.header');
  const mobileToggle = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileToggle.classList.toggle('open');
    });

    // Fechar menu ao clicar num link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('open');
      });
    });
  }
}

/* ==========================================
   2. SLIDER ANTES & DEPOIS INTERATIVO
   ========================================== */
function initBeforeAfterSlider() {
  const container = document.querySelector('.before-after-container');
  const afterImg = document.querySelector('.ba-after');
  const handle = document.querySelector('.ba-slider-handle');

  if (!container || !afterImg || !handle) return;

  let isDragging = false;

  const moveSlider = (x) => {
    const rect = container.getBoundingClientRect();
    let posX = x - rect.left;
    if (posX < 0) posX = 0;
    if (posX > rect.width) posX = rect.width;

    const percentage = (posX / rect.width) * 100;
    afterImg.style.width = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  };

  handle.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mouseup', () => isDragging = false);

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    moveSlider(e.clientX);
  });

  // Suporte para Telas Touch (Celular/Tablet)
  handle.addEventListener('touchstart', () => isDragging = true);
  window.addEventListener('touchend', () => isDragging = false);
  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      moveSlider(e.touches[0].clientX);
    }
  });
}

/* ==========================================
   3. CALCULADORA DE ESTIMATIVA DE ORÇAMENTO
   ========================================== */
function initCalculator() {
  const serviceSelect = document.getElementById('calc-service');
  const areaInput = document.getElementById('calc-area');
  const areaValDisplay = document.getElementById('area-val');
  const finishSelect = document.getElementById('calc-finish');
  const priceDisplay = document.getElementById('result-price');
  const btnCalcWhatsapp = document.getElementById('btn-calc-whatsapp');

  if (!serviceSelect || !areaInput || !priceDisplay) return;

  // Preço base por m² em R$ para mão de obra por categoria
  const basePrices = {
    porcelanato: { base: 65, label: "Assentamento de Porcelanato & Cerâmica" },
    alvenaria: { base: 80, label: "Alvenaria & Paredes" },
    banheiro: { base: 120, label: "Reforma Completa de Banheiro" },
    telhado: { base: 75, label: "Telhados & Impermeabilização" },
    pintura: { base: 35, label: "Pintura & Acabamento Fino" },
    geral: { base: 150, label: "Reforma Geral Residencial" }
  };

  const finishMultipliers = {
    padrao: 1.0,
    premium: 1.3,
    luxo: 1.6
  };

  function updateEstimate() {
    const serviceKey = serviceSelect.value;
    const area = parseFloat(areaInput.value);
    const finishKey = finishSelect.value;

    if (areaValDisplay) areaValDisplay.textContent = `${area} m²`;

    const serviceObj = basePrices[serviceKey] || basePrices.porcelanato;
    const mult = finishMultipliers[finishKey] || 1.0;

    const baseVal = area * serviceObj.base * mult;
    const minVal = Math.round(baseVal * 0.9);
    const maxVal = Math.round(baseVal * 1.15);

    const formattedMin = minVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
    const formattedMax = maxVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

    priceDisplay.textContent = `${formattedMin} – ${formattedMax}`;

    // Atualizar botão para mensagem preenchida no WhatsApp
    if (btnCalcWhatsapp) {
      const msg = `Olá! Realizei uma simulação no seu site:\n\n*Serviço:* ${serviceObj.label}\n*Área:* ${area} m²\n*Nível de Acabamento:* ${finishSelect.options[finishSelect.selectedIndex].text}\n*Estimativa:* ${formattedMin} a ${formattedMax}\n\nGostaria de agendar uma visita sem compromisso!`;
      const encodedMsg = encodeURIComponent(msg);
      btnCalcWhatsapp.href = `https://wa.me/${CONFIG.telefoneWhatsApp}?text=${encodedMsg}`;
    }
  }

  serviceSelect.addEventListener('change', updateEstimate);
  areaInput.addEventListener('input', updateEstimate);
  finishSelect.addEventListener('change', updateEstimate);

  // Execução inicial
  updateEstimate();
}

/* ==========================================
   4. FILTROS DO PORTFÓLIO
   ========================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Mudar botão ativo
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'todos' || filterValue === itemCategory) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================
   5. LIGHTBOX / MODAL DE FOTOS
   ========================================== */
function initLightbox() {
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-img');
  const closeBtn = document.querySelector('.modal-close');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (!modal || !modalImg) return;

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
        modal.classList.add('active');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
}

/* ==========================================
   6. ACCORDION FAQ
   ========================================== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Fechar outros itens
        faqItems.forEach(i => i.classList.remove('active'));

        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ==========================================
   7. PREENCHER TEXTOS DINÂMICOS
   ========================================== */
function updateConfigurableTexts() {
  // Atualizar links gerais do WhatsApp na página
  const whatsappLinks = document.querySelectorAll('.whatsapp-dynamic-link');
  const defaultMsg = encodeURIComponent(`Olá ${CONFIG.nomeProfissional}! Encontrei seu site e gostaria de solicitar um orçamento para meu projeto.`);
  
  whatsappLinks.forEach(link => {
    link.href = `https://wa.me/${CONFIG.telefoneWhatsApp}?text=${defaultMsg}`;
  });
}
