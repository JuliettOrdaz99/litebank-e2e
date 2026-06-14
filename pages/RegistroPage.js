export class RegistroPage {
  constructor(page) {
    this.page = page;

    // Campo Nombre
    this.nombreInput = page.locator('#nombre');

    // Campo Email
    this.emailInput = page.locator('#email');

    // Campo Contraseña
    this.passwordInput = page.locator('#password');

    // Botón Registrar
    this.registrarButton = page.getByRole('button', { name: 'Registrar' });

    // Mensaje de estado del registro
    this.statusBox = page.locator('#status');
  }

  async abrirPagina() {
    await this.page.goto('/');
  }

  async registrarUsuario(nombre, email, password) {
    await this.nombreInput.fill(nombre);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.registrarButton.click();
  }
}