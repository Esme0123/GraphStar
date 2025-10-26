# Guía Rápida: Northwest Solver (Problema de Transporte)

Esta guía explica cómo capturar un problema de transporte en Northwest Solver, equilibrar la matriz y obtener la solución óptima usando la regla de la esquina noroeste y el método MODI.

## 1. Estructura general de la pantalla

- **Barra superior**  
  - `Volver`: regresa al menú principal.  
  - **Interruptor Minimizar/Maximizar**: elige si deseas minimizar costos o maximizar beneficios.  
  - `Tutorial`: abre el video explicativo integrado.
- **Pestañas principales**  
  1. *Matriz de Entrada*: captura y edita los datos del problema.  
  2. *Solución*: muestra la asignación óptima y el costo total.  
  3. *Iteraciones*: detalla cada paso del método MODI.

## 2. Configurar la matriz de entrada

1. **Definir costos unitarios**  
   - Cada celda de la tabla corresponde al costo de enviar desde un origen (columna) hacia un destino (fila).
   - Introduce valores numéricos no negativos.  

2. **Capturar oferta y demanda**  
   - La columna final (Oferta) representa la disponibilidad de cada origen.  
   - La fila inferior (Demanda) indica lo que necesita cada destino.

3. **Balance automático**  
   - Si la suma de oferta y demanda no coincide, Northwest Solver añade automáticamente una fila o columna ficticia (marcada como “Balance”) con costo cero y la cantidad faltante.
   - Estas celdas son de solo lectura para mantener el balance.

4. **Agregar o eliminar filas/columnas**  
   - Usa los botones *Agregar Fila/Columna* y *Eliminar Fila/Columna* para ajustar la dimensión de la matriz.  
   - La interfaz evita eliminar la última fila o columna disponible.

5. **Importar y exportar datos**  
   - `Importar JSON` / `Importar CSV`: carga un archivo con la estructura de costos, oferta, demanda y tipo de problema.  
   - `Exportar JSON` / `Exportar CSV`: descarga el problema actual para reutilizarlo.

6. **Resetear**  
   - `Resetear` limpia la matriz y restablece la configuración inicial (3×3, valores cero y modo Minimizar).

## 3. Calcular la solución

1. Verifica que oferta y demanda sean correctas (el indicador en la parte superior de la tabla muestra la diferencia).
2. Presiona `Calcular Solución`.  
3. Si los datos son válidos, la pestaña *Solución* se habilita automáticamente y muestra:  
   - Celdas resaltadas en verde con la cantidad asignada.  
   - El costo total óptimo, expresado con dos decimales.  
4. Cambia a la pestaña *Iteraciones* para revisar el proceso completo:  
   - Asignaciones por iteración.  
   - Costos reducidos y variable entrante en cada paso.

## 4. Buenas prácticas

- Revisa la diferencia Oferta vs Demanda antes de calcular; un valor distinto de cero indica que se añadirá una fila o columna ficticia.  
- Usa números con máximo cuatro decimales para evitar redondeos inesperados.  
- Aprovecha la **pestaña Iteraciones** para validar los pasos del método MODI y comparar con tus cálculos manuales.

---

¿Necesitas una introducción visual? Haz clic en el botón `Tutorial` dentro del Northwest Solver para ver el video paso a paso.
