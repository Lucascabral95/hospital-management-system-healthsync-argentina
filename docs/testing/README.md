# Estrategia de Testing

Este documento describe la estrategia base para introducir pruebas profesionales en el proyecto **Hospital Management System**. Sirve como guía inicial antes de escribir pruebas concretas.

## Objetivos

1. Garantizar calidad y estabilidad en cada módulo.
2. Detectar regresiones de manera temprana mediante automatización.
3. Mantener una base de pruebas legible, confiable y fácil de mantener.

## Alcance y Tipos de Pruebas

- **Unitarias:** Validan servicios, pipes, componentes y guards de forma aislada, utilizando dobles de prueba para dependencias.
- **Integración por característica:** Montan componentes con sus dependencias reales (routing, servicios HTTP simulados, etc.) para verificar flujos completos.
- **End-to-end (futuro):** Validarán recorridos críticos de usuario (quedará definido más adelante una vez consolidado el testing unitario/integración).

## Herramientas Base

- **Framework:** Jasmine (incluido por Angular).
- **Runner:** Karma con ChromeHeadless.
- **Cobertura:** `karma-coverage` con umbrales mínimos del 80% (ver configuración en `karma.conf.js`).
- **Utilidades:** `TestBed`, `Harnesses` de Angular Material (cuando aplique) y utilidades compartidas dentro de `src/testing`.

> 💡 Si en el futuro se decide migrar a Jest o incluir `@testing-library/angular`, este documento se actualizará para reflejar la nueva herramienta.

## Convenciones

- Colocar los archivos de prueba junto al archivo objetivo utilizando el sufijo `.spec.ts`.
- Mantener la nomenclatura `describe` → `context` → `it` para expresar escenarios.
- Usar `test-setup.ts` para configuración global (matchers, mocks comunes, polyfills adicionales).
- Centralizar helpers reutilizables dentro de `src/testing/`.
- Evitar depender de servicios reales (HTTP, WebSocket). Utilizar dobles (`spy`, `Subject`, `MockProvider`).

## Estructura Propuesta

```
src/
  test.ts              # Punto de entrada de Karma (carga todos los .spec.ts)
  test-setup.ts        # Configuración global de pruebas
  testing/
    index.ts           # Re-exporta helpers comunes
    http-testing.ts    # Configuración para pruebas con HttpClient (futuro)
    component-helpers.ts
```

Cada módulo podrá definir subcarpetas específicas dentro de `src/testing` conforme se creen necesidades concretas (mocks de sockets, factories, etc.).

## Scripts Disponibles

| Script           | Descripción                                                |
|------------------|------------------------------------------------------------|
| `npm run test`   | Ejecuta la suite en modo headless, una única vez.          |
| `npm run test:watch` | Ejecuta Karma en modo `watch` para desarrollo local. |
| `npm run test:coverage` | Genera reporte de cobertura en `coverage/`.       |
| `npm run test:debug` | Abre Chrome estándar para depurar manualmente.       |

## Estrategia de Cobertura

- Umbrales globales establecidos en 80% líneas/funciones/branches.
- La cobertura no es el objetivo en sí mismo, sino una métrica para detectar huecos. Se priorizará cobertura significativa sobre alcanzar números arbitrarios.
- Revisar `coverage/lcov-report/index.html` después de cada ejecución para identificar zonas sin cobertura.

## Roadmap de Implementación

1. **Fase 1 (Actual):** Configuración base, scripts y documentación → ✅.
2. **Fase 2:** Incorporar pruebas unitarias en módulos críticos (`auth`, `appointments`, `patients`).
3. **Fase 3:** Introducir pruebas de integración con routing y módulos compartidos.
4. **Fase 4:** Evaluar e implementar pruebas end-to-end (Playwright o Cypress).

## Buenas Prácticas Sugeridas

- Mantener las pruebas independientes del entorno (no asumir datos remotos).
- Utilizar `beforeEach`/`afterEach` para dejar limpio el `TestBed`.
- Evitar asserts genéricos; describir expectativas concretas.
- Documentar helpers complejos con comentarios breves.
- Revisar `CHANGELOG`/`README` al agregar nuevas capacidades de testing.

---

> **Próximo paso:** comenzar a crear pruebas unitarias priorizando servicios e infraestructura, apoyándose en esta configuración base.
