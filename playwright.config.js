// @ts-check

// Importamos defineConfig para crear la configuración oficial de Playwright.
// Importamos devices para poder usar configuraciones predefinidas de navegadores,
// por ejemplo "Desktop Chrome", "Desktop Firefox", etc.
import { defineConfig, devices } from '@playwright/test';

/**
 * Archivo principal de configuración de Playwright.
 *
 * Aquí definimos:
 * - Dónde están los tests.
 * - Cuánto tiempo puede durar un test.
 * - Cuánto tiempo deben esperar los expect().
 * - En qué navegador se ejecutará.
 * - Si corre en modo headless.
 * - Si guarda screenshots, videos o traces.
 * - Qué tipo de reporte genera.
 */
export default defineConfig({
  /**
   * Carpeta donde Playwright buscará los archivos de prueba.
   *
   * En tu proyecto, tus tests deben estar dentro de:
   * /tests
   *
   * Ejemplo:
   * tests/registro-async.spec.js
   */
  testDir: './tests',

  /**
   * Tiempo máximo que puede durar un test completo.
   *
   * 30000 ms = 30 segundos.
   *
   * Esto incluye:
   * - Abrir la página.
   * - Llenar formulario.
   * - Hacer clic.
   * - Esperar la respuesta final.
   *
   * Para tu proyecto es suficiente porque el proceso asíncrono tarda
   * aproximadamente de 3 a 5 segundos.
   */
  timeout: 30000,

  /**
   * Configuración global para los expect().
   *
   * Esto es MUY importante para tu reto porque aquí configuramos
   * el polling inteligente.
   *
   * 10000 ms = 10 segundos.
   *
   * Significa que cuando uses algo como:
   *
   * await expect(statusBox).toContainText('Usuario Creado Exitosamente');
   *
   * Playwright NO fallará inmediatamente.
   * Playwright revisará varias veces si el texto cambia hasta que:
   *
   * 1. Encuentre el texto esperado, o
   * 2. Se cumplan los 10 segundos.
   *
   * Esto evita usar esperas duras como:
   * await page.waitForTimeout(5000);
   *
   * Esa es la estrategia correcta para validar consistencia eventual.
   */
  expect: {
    timeout: 10000,
  },

  /**
   * Permite que los archivos de prueba se ejecuten en paralelo.
   *
   * Para proyectos grandes ayuda a que las pruebas corran más rápido.
   *
   * En tu caso solo tienes un flujo principal, así que no afecta mucho.
   */
  fullyParallel: true,

  /**
   * Evita subir código con test.only cuando estés en CI/CD.
   *
   * test.only sirve para ejecutar solo una prueba durante desarrollo.
   *
   * Pero si se queda por error en GitHub Actions, podría hacer que
   * solo se ejecute una prueba y se ignoren las demás.
   *
   * Por eso, en CI, si detecta test.only, falla el pipeline.
   */
  forbidOnly: !!process.env.CI,

  /**
   * Reintentos automáticos.
   *
   * Localmente:
   * retries = 0
   * Si falla, falla inmediatamente.
   *
   * En GitHub Actions:
   * retries = 2
   * Si falla, Playwright intenta correr el test hasta 2 veces más.
   *
   * Esto ayuda cuando hay fallos temporales por latencia,
   * aunque lo ideal es que tu test sea estable gracias al polling.
   */
  retries: process.env.CI ? 2 : 0,

  /**
   * Número de workers, es decir, cuántas pruebas pueden correr al mismo tiempo.
   *
   * En CI usamos 1 worker para evitar problemas de concurrencia.
   *
   * Esto es útil porque tu flujo registra usuarios y usa Kafka.
   * Si varias pruebas corren al mismo tiempo, podrían interferir entre sí.
   */
  workers: process.env.CI ? 1 : undefined,

  /**
   * Reportes que generará Playwright.
   *
   * html:
   * Genera un reporte visual que puedes abrir en navegador.
   *
   * list:
   * Muestra el resultado de las pruebas directamente en terminal.
   */
  reporter: [['html'], ['list']],

  /**
   * Configuración compartida para todos los tests.
   *
   * Todo lo que pongas dentro de use aplicará a cada prueba.
   */
  use: {
    /**
     * URL base de tu aplicación.
     *
     * Gracias a esto, en tus tests puedes usar:
     *
     * await page.goto('/');
     *
     * en lugar de:
     *
     * await page.goto('http://localhost:3000');
     */
    baseURL: 'http://localhost:3000',

    /**
     * Ejecuta el navegador sin abrir una ventana visible.
     *
     * true:
     * Corre en segundo plano. Ideal para GitHub Actions.
     *
     * false:
     * Abre el navegador visualmente. Útil para debugging local.
     */
    headless: true,

    /**
     * Guarda una captura de pantalla solo cuando el test falla.
     *
     * Esto sirve como evidencia para analizar errores.
     */
    screenshot: 'only-on-failure',

    /**
     * Guarda video solo cuando el test falla.
     *
     * Es útil para ver exactamente qué hizo la prueba antes de fallar.
     */
    video: 'retain-on-failure',

    /**
     * Guarda un trace cuando el test falla.
     *
     * El trace es una herramienta muy poderosa de Playwright.
     * Permite revisar paso por paso:
     *
     * - Qué acción hizo el test.
     * - Qué elemento encontró.
     * - Qué vio el navegador.
     * - En qué momento falló.
     *
     * Para tu proyecto es útil porque puedes demostrar que sabes
     * analizar fallos en automatización.
     */
    trace: 'retain-on-failure',
  },

  /**
   * Navegadores donde se ejecutarán las pruebas.
   *
   * Para empezar, te recomiendo usar solo Chromium.
   *
   * ¿Por qué?
   * Porque primero queremos que el flujo sea estable.
   * Después puedes activar Firefox y WebKit.
   */
  projects: [
    {
      /**
       * Nombre del proyecto de ejecución.
       *
       * Este nombre aparecerá en la terminal y en el reporte.
       */
      name: 'chromium',

      /**
       * Usa la configuración predefinida de Playwright para Desktop Chrome.
       *
       * Esto configura viewport, user agent y comportamiento similar
       * a un navegador de escritorio.
       */
      use: { ...devices['Desktop Chrome'] },
    },

    /**
     * Puedes activar Firefox después de que tu prueba ya sea estable.
     */

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    /**
     * Puedes activar WebKit después.
     *
     * WebKit representa el motor usado por Safari.
     */

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /**
   * webServer sirve cuando Playwright debe levantar la aplicación
   * automáticamente antes de correr los tests.
   *
   * En tu caso NO lo activamos porque tu aplicación se levanta con Docker:
   *
   * docker compose up -d
   *
   * Entonces primero debes levantar los contenedores y luego ejecutar:
   *
   * npx playwright test
   */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});