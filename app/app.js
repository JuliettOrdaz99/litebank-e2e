const form = document.getElementById('registroForm');
const statusBox = document.getElementById('status');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (!nombre || !email || !password) {
    statusBox.textContent = 'Todos los campos son obligatorios';
    return;
  }

  statusBox.textContent = 'Procesando registro...';

  setTimeout(() => {
    statusBox.textContent = 'Usuario Creado Exitosamente';
  }, 4000);
});