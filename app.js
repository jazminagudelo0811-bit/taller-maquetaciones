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

  // 2. Carrito y preparación del pedido
  const cartItems = new Map();
  const cartList = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const placeOrder = document.getElementById('placeOrder');
  const contactForm = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  const formatPrice = amount => new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount);

  const updateCart = () => {
    if (!cartList || !cartTotal) return;
    cartList.innerHTML = '';
    let total = 0;

    if (!cartItems.size) {
      cartList.innerHTML = '<li>Tu carrito está vacío.</li>';
    }

    cartItems.forEach(item => {
      total += item.price * item.quantity;
      const row = document.createElement('li');
      row.textContent = `${item.name} × ${item.quantity} — ${formatPrice(item.price * item.quantity)}`;
      cartList.appendChild(row);
    });

    cartTotal.textContent = formatPrice(total);
    if (placeOrder) placeOrder.disabled = !cartItems.size;
  };

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const name = button.dataset.name || button.closest('.menu-card')?.querySelector('h3')?.textContent.trim();
      const price = Number(button.dataset.price);
      if (!name || !Number.isFinite(price) || price <= 0) return;
      const item = cartItems.get(name);
      cartItems.set(name, {
        name,
        price: Number(price),
        quantity: item ? item.quantity + 1 : 1
      });
      updateCart();
    });
  });

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

      if (!cartItems.size) {
        feedback.textContent = 'Agrega al menos un producto antes de confirmar el pedido.';
        feedback.classList.add('error');
        return;
      }

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
        const orderNumber = `CV-${Date.now().toString().slice(-6)}`;
        const orderSummary = [...cartItems.values()]
          .map(item => `${item.name} × ${item.quantity}`)
          .join(', ');
        const total = [...cartItems.values()]
          .reduce((sum, item) => sum + item.price * item.quantity, 0);
        feedback.textContent = `Pedido ${orderNumber} generado para ${nombre.value.trim()} (${email.value.trim()}). Productos: ${orderSummary}. Indicaciones: ${mensaje.value.trim()}. Total: ${formatPrice(total)}. Confirmación local: el pedido aún no se envía al establecimiento.`;
        feedback.classList.add('success');
        cartItems.clear();
        updateCart();
      } else {
        feedback.textContent = 'Por favor completa los campos marcados correctamente.';
        feedback.classList.add('error');
      }
    });
  }
});