# GraphStar

Aplicacion web educativa para visualizar y simular algoritmos (grafos, arboles, ordenamiento, transporte), con integracion opcional a MATLAB y Fuzzy Logic. Construido con Create React App, ReactFlow y un backend Express ligero para lanzar MATLAB localmente.

## Contenidos principales
- **Grafos:** Editor visual con modos Pizarra/Johnson/Assignment/Dijkstra, guardado/carga de grafos y simulaciones.
- **Kruskal:** Calculo de MST con visualizacion paso a paso.
- **NorthWest (Transporte):** Construccion de matrices, solucion Noroeste y MODI.
- **Sort / Trees:** Modulos de algoritmos de ordenamiento y estructuras de arboles.
- **MathLab:** Panel que abre MATLAB, MATLAB con Fuzzy y carga de archivos `.fis` al disenador Fuzzy; incluye tutorial embebido y manual HTML/PDF.
- **Manuales:** HTML/PDF en `public/manuals` y script para regenerarlos.

## Requisitos
- Node.js 18+ y npm.
- (Opcional) MATLAB instalado localmente para usar el panel MathLab. Ajusta la variable de entorno `MATLAB_CMD` si no esta en el PATH, por ejemplo:
  - Windows: `MATLAB_CMD="C:\\Program Files\\MATLAB\\R2024b\\bin\\matlab.exe"`
  - macOS/Linux: `MATLAB_CMD="/usr/local/MATLAB/R2024b/bin/matlab"`

## Instalacion
```bash
npm install
```

## Ejecucion en desarrollo
En dos terminales separadas:
1) **Backend MATLAB (puerto 3001)**  
```bash
npm run matlab-server
```
- Endpoints clave:  
  - `GET /abrir-matlab` abre MATLAB.  
  - `GET /abrir-matlab-fuzzy` abre MATLAB con `fuzzy`.  
  - `POST /abrir-fis` abre un `.fis` enviado en base64.  
  - `GET /abrir-fuzzy?nombre=archivo.fis` abre un `.fis` que ya exista en la carpeta del proyecto.
- Sirve estaticos desde `public/` (manuales incluidos).

2) **Frontend (CRA, puerto 3000)**  
```bash
npm start
```
El `proxy` en `package.json` redirige `/api` y las rutas anteriores hacia el backend de MATLAB en `http://localhost:3001` durante desarrollo.

## Uso rapido de la interfaz
- Al iniciar veras la pantalla de carga y luego el **Home** con modulos (Grafos, Kruskal, NorthWest, Sort, Trees, MathLab).
- **MathLab:** incluye tutorial (YouTube) y botones para abrir MATLAB, MATLAB+Fuzzy o seleccionar un `.fis`. Boton de ayuda (?) abre el manual `public/manuals/Matlab_Manual.html` (PDF en la misma carpeta).
- En grafos puedes crear nodos/aristas, elegir tipos de arista, guardar/cargar, ver matriz de adyacencia, y ejecutar simulaciones segun el modo seleccionado.
- En transporte (NorthWest) puedes construir matrices, calcular solucion y revisar iteraciones con MODI.

## Scripts disponibles
- `npm start` — Arranca CRA en `http://localhost:3000` (frontend).
- `npm run matlab-server` — Arranca backend Express en `http://localhost:3001` para comandos MATLAB/Fuzzy.
- `npm run build` — Construye el bundle de produccion en `build/`.
- `npm test` — Ejecuta tests de CRA.
- `npm run generate-manual-pdf` — Genera PDFs de manuales (requiere `puppeteer` instalado; incluye `Matlab_Manual`).
- `node scripts/createMatlabPdf.js` — Genera un PDF ligero de `Matlab_Manual` sin depender de navegador headless.

## Estructura relevante
- `src/App.js` — Enrutado de vistas y modales de tutorial.
- `src/components/` — Paginas y controles por modulo (Home, GraphEditor, KruskalGraphStar, TransportePage, SortSimulatorPage, TreeSimulator, MatlabPage, etc.).
- `src/index.css` — Estilos globales y secciones tematicas (incluye estilos del panel MATLAB y boton de ayuda).
- `matlabServer.js` — Servidor Express para lanzar MATLAB/Fuzzy y manejar subida de `.fis`.
- `public/manuals/` — Manuales HTML/PDF (incluye `Matlab_Manual.html` y `Matlab_Manual.pdf`).
- `scripts/generateManualPdf.js` — Genera PDFs de manuales usando `puppeteer` (Kruskal, NorthWest, Dijkstra, Matlab, etc.).

## Notas y solucion de problemas
- Si MATLAB no abre desde la UI, configura `MATLAB_CMD` o agrega MATLAB al PATH, y reinicia `npm run matlab-server`.
- En Windows se usa `start "" matlab ...` para lanzar la aplicacion; si usas otra ruta asegurate de incluir comillas.
- Para abrir un `.fis` local sin subirlo, colocarlo junto a `matlabServer.js` y usar `GET /abrir-fuzzy?nombre=tu_archivo.fis`.
- Los manuales se sirven como estaticos; el boton (?) de la seccion MathLab abre el HTML, tambien puedes abrir el PDF en la misma carpeta.

## Build y despliegue
```bash
npm run build
```
El resultado queda en `build/`. Sirve los archivos estaticos desde cualquier servidor web. Si requieres funciones MATLAB en produccion, necesitas exponer un servicio similar a `matlabServer.js` con acceso al MATLAB de escritorio (no se soporta en entornos serverless).
