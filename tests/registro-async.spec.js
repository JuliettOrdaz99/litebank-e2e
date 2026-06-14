import { test, expect } from '@playwright/test';
import { RegistroPage } from '../pages/RegistroPage';

test('registro de usuario asíncrono exitoso', async ({ page }) => {
  const registroPage = new RegistroPage(page);

  const emailUnico = `test_${Date.now()}@mail.com`;

  await registroPage.abrirPagina();

  await registroPage.registrarUsuario(
    'Juliett QA',
    emailUnico,
    'Password123!'
  );

  await expect(registroPage.statusBox).toContainText(
    'Usuario Creado Exitosamente',
    { timeout: 10000 }
  );
});