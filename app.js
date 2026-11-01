document.addEventListener('DOMContentLoaded', () => {
  // 1. Menú Móvil
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('is-active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Validación de Formulario de Contacto
  const contactForm = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nombre = document.getElementById('nombre');
      const email = document.getElementById('email');
      const mensaje = document.getElementById('mensaje');

      const errNom = document.getElementById('errorNombre');
      const errEml = document.getElementById('errorEmail');
      const errMsg = document.getElementById('errorMensaje');

      // Limpiar estados previos
      errNom.textContent = ''; 
      errEml.textContent = ''; 
      errMsg.textContent = '';
      feedback.textContent = ''; 
      feedback.className = 'form-feedback';

      let isValid = true;

      if (!nombre.value.trim()) {
        errNom.textContent = 'Ingresa tu nombre completo.';
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        errEml.textContent = 'Ingresa un correo electrónico válido.';
        isValid = false;
      }

      if (!mensaje.value.trim() || mensaje.value.trim().length < 8) {
        errMsg.textContent = 'El mensaje debe tener al menos 8 caracteres.';
        isValid = false;
      }

      if (isValid) {
        feedback.textContent = '¡Mensaje recibido! Nos comunicaremos contigo a la brevedad.';
        feedback.classList.add('success');
        contactForm.reset();
      } else {
        feedback.textContent = 'Por favor completa los campos marcados correctamente.';
        feedback.classList.add('error');
      }
    });
  }
});