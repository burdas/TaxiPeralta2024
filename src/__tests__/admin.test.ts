import { test, expect } from '@playwright/test';

test('debe redirigir a alguna ubicación', async ({ page }) => {
  const response = await page.goto('http://localhost:4321/admin');
  
  // Verificar que hubo una redirección (la URL de respuesta es diferente a la solicitada)
  const responseUrl = response?.url();
  expect(responseUrl).not.toBe('http://localhost:4321/admin');
  expect(responseUrl).toBeTruthy();
});