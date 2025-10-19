import React from 'react';

const IteracionesVista = ({ resultado, iteracionActual, onCambiarIteracion }) => {
  const iteraciones = resultado?.procesoIteraciones || [];

  if (!iteraciones.length) {
    return (
      <div className="transporte-panel">
        <p className="transporte-help-text">
          Calcula la solución para revisar el detalle paso a paso del método MODI.
        </p>
      </div>
    );
  }

  const indiceSeguro = Math.min(Math.max(iteracionActual, 0), iteraciones.length - 1);
  const iteracion = iteraciones[indiceSeguro];
  const totalIteraciones = iteraciones.length;
  const variableEntrante = iteracion.variableEntrante;
  const columnasAsignacion = iteracion.matrizAsignacion[0]?.length ?? 0;
  const columnasReducidos = iteracion.costosReducidos[0]?.length ?? 0;

  const mover = (paso) => {
    const siguiente = Math.min(Math.max(indiceSeguro + paso, 0), totalIteraciones - 1);
    if (siguiente !== indiceSeguro) {
      onCambiarIteracion(siguiente);
    }
  };

  const renderValorDelta = (valor) => {
    if (valor === 'Básica') {
      return 'Básica';
    }
    const numero = Number(valor);
    if (!Number.isFinite(numero)) {
      return valor;
    }
    return numero.toFixed(2);
  };

  return (
    <div className="transporte-panel">
      <header className="transporte-panel-header">
        <h2>Iteraciones del Método MODI</h2>
        <div className="iteracion-nav">
          <button type="button" onClick={() => mover(-1)} disabled={indiceSeguro === 0}>
            &lt; Anterior
          </button>
          <span>
            Iteración {indiceSeguro + 1} de {totalIteraciones}
          </span>
          <button
            type="button"
            onClick={() => mover(1)}
            disabled={indiceSeguro >= totalIteraciones - 1}
          >
            Siguiente &gt;
          </button>
        </div>
      </header>

      <div className="iteracion-layout">
        <section>
          <h3>Matriz de Asignación</h3>
          <div className="transporte-table-wrapper">
            <table className="transporte-table iteracion-table">
              <thead>
                <tr>
                  <th />
                  {Array.from({ length: columnasAsignacion }, (_, indice) => (
                    <th key={`iter-assign-col-${indice}`}>Origen {indice + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {iteracion.matrizAsignacion.map((fila, indiceFila) => (
                  <tr key={`iter-assign-row-${indiceFila}`}>
                    <th>Destino {indiceFila + 1}</th>
                    {fila.map((valor, indiceColumna) => {
                      const cantidad = Number(valor) || 0;
                      const esEntrante =
                        variableEntrante &&
                        variableEntrante.fila === indiceFila &&
                        variableEntrante.columna === indiceColumna;
                      const clases = [
                        cantidad > 0 ? 'is-assigned' : 'cell-empty',
                        esEntrante ? 'is-entering-variable' : null,
                      ]
                        .filter(Boolean)
                        .join(' ');
                      return (
                        <td key={`iter-assign-${indiceFila}-${indiceColumna}`} className={clases}>
                          {cantidad > 0 ? cantidad : '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3>Costos Reducidos (Δ)</h3>
          <div className="transporte-table-wrapper">
            <table className="transporte-table iteracion-table">
              <thead>
                <tr>
                  <th />
                  {Array.from({ length: columnasReducidos }, (_, indice) => (
                    <th key={`iter-delta-col-${indice}`}>Origen {indice + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {iteracion.costosReducidos.map((fila, indiceFila) => (
                  <tr key={`iter-delta-row-${indiceFila}`}>
                    <th>Destino {indiceFila + 1}</th>
                    {fila.map((valor, indiceColumna) => {
                      const esEntrante =
                        variableEntrante &&
                        variableEntrante.fila === indiceFila &&
                        variableEntrante.columna === indiceColumna;
                      const esBasica = valor === 'Básica';
                      const clases = [
                        esBasica ? 'cell-basic' : 'cell-non-basic',
                        esEntrante ? 'is-entering-variable' : null,
                      ]
                        .filter(Boolean)
                        .join(' ');
                      return (
                        <td key={`iter-delta-${indiceFila}-${indiceColumna}`} className={clases}>
                          {renderValorDelta(valor)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <p className="iteracion-help">
        Resalta en verde las celdas básicas. La clase <span className="leyenda leyenda-entrante">is-entering-variable</span> marca la celda candidata a entrar en la base.
      </p>
    </div>
  );
};

export default IteracionesVista;
