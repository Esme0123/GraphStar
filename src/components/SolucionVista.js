import React from 'react';

const SolucionVista = ({ resultado, tipoProblema }) => {
  if (!resultado) {
    return (
      <div className="transporte-panel">
        <p className="transporte-help-text">
          Calcula la solución para mostrar la asignación óptima y el costo asociado.
        </p>
      </div>
    );
  }

  const { costoTotalOptimo, matrizAsignacionOptima, balanceo } = resultado;
  const columnas = matrizAsignacionOptima[0]?.length ?? 0;

  return (
    <div className="transporte-panel">
      <header className="transporte-panel-header">
        <div>
          <h2>Solución Óptima</h2>
          <p className="transporte-panel-subtitle">
            Resultado final obtenido mediante la regla de la esquina Noroeste y el método MODI.
          </p>
        </div>
        <div className="transporte-total">
          <span className="transporte-total-label">Costo Total Óptimo</span>
          <span className="transporte-total-value">{costoTotalOptimo.toFixed(2)}</span>
          <span className="transporte-total-type">{tipoProblema}</span>
        </div>
      </header>

      {balanceo?.dummyTipo && (
        <div className="transporte-balance-note">
          {balanceo.dummyTipo === 'oferta' ? (
            <span>
              Se agregó una <strong>oferta ficticia</strong> de {balanceo.dummyFilaValor} unidades
              para balancear la demanda.
            </span>
          ) : (
            <span>
              Se agregó una <strong>demanda ficticia</strong> de {balanceo.dummyColumnaValor} unidades
              para balancear la oferta.
            </span>
          )}
        </div>
      )}

      <div className="transporte-table-wrapper">
        <table className="transporte-table assignment-table">
          <thead>
            <tr>
              <th />
              {Array.from({ length: columnas }, (_, indice) => (
                <th key={`sol-col-${indice}`}>Origen {indice + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrizAsignacionOptima.map((fila, indiceFila) => (
              <tr key={`sol-row-${indiceFila}`}>
                <th>Destino {indiceFila + 1}</th>
                {fila.map((valor, indiceColumna) => {
                  const numero = Number(valor);
                  const esNumero = Number.isFinite(numero);
                  const esAsignacion = esNumero && Math.abs(numero) > 1e-6;
                  const textoCelda = esAsignacion
                    ? (Number.isInteger(numero) ? numero : Number(numero.toFixed(4)))
                    : '-';
                  return (
                    <td
                      key={`sol-cell-${indiceFila}-${indiceColumna}`}
                      className={esAsignacion ? 'cell-assigned-positive' : 'cell-empty'}
                    >
                      {textoCelda}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SolucionVista;
