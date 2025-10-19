import React, { useRef } from 'react';

const formatNumber = (valor) => {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) {
    return '';
  }
  return numero;
};

const MatrizEntrada = ({
  matrizCostos,
  oferta,
  demanda,
  tipoProblema,
  totalOferta,
  totalDemanda,
  puedeEliminarFila,
  puedeEliminarColumna,
  onChangeCosto,
  onChangeOferta,
  onChangeDemanda,
  onAgregarFila,
  onEliminarFila,
  onAgregarColumna,
  onEliminarColumna,
  onResetear,
  onCalcular,
  onImportarJSON,
  onImportarCSV,
  onExportarJSON,
  onExportarCSV,
  error,
  onCerrarError,
}) => {
  const inputJsonRef = useRef(null);
  const inputCsvRef = useRef(null);

  const diferencia = Number((totalOferta - totalDemanda).toFixed(4));
  const balanceado = Math.abs(diferencia) < 1e-6;

  const manejarImportacionJson = (evento) => {
    const archivo = evento.target.files?.[0];
    if (archivo) {
      onImportarJSON(archivo);
    }
    evento.target.value = '';
  };

  const manejarImportacionCsv = (evento) => {
    const archivo = evento.target.files?.[0];
    if (archivo) {
      onImportarCSV(archivo);
    }
    evento.target.value = '';
  };

  return (
    <div className="transporte-panel">
      <header className="transporte-panel-header">
        <div>
          <h2>Matriz de Costos</h2>
          <p className="transporte-panel-subtitle">
            Edita las celdas para capturar los costos unitarios, la oferta y la demanda.
          </p>
        </div>
        <div className="transporte-balance">
          <span><strong>Oferta:</strong> {totalOferta.toFixed(2)}</span>
          <span><strong>Demanda:</strong> {totalDemanda.toFixed(2)}</span>
          <span className={balanceado ? 'balance-ok' : 'balance-warning'}>
            <strong>Diferencia:</strong> {diferencia.toFixed(2)}
          </span>
        </div>
      </header>

      <div className="transporte-import-controls">
        <button type="button" onClick={() => inputJsonRef.current?.click()}>
          Importar JSON
        </button>
        <button type="button" onClick={() => inputCsvRef.current?.click()}>
          Importar CSV
        </button>
        <button type="button" onClick={onExportarJSON}>
          Exportar JSON
        </button>
        <button type="button" onClick={onExportarCSV}>
          Exportar CSV
        </button>
      </div>
      <input
        ref={inputJsonRef}
        type="file"
        accept=".json,application/json"
        className="transporte-hidden-input"
        onChange={manejarImportacionJson}
      />
      <input
        ref={inputCsvRef}
        type="file"
        accept=".csv,text/csv"
        className="transporte-hidden-input"
        onChange={manejarImportacionCsv}
      />

      {error && (
        <div className="transporte-error" role="alert">
          <span>{error}</span>
          <button type="button" onClick={onCerrarError}>
            Cerrar
          </button>
        </div>
      )}

      <div className="transporte-table-wrapper">
        <table className="transporte-table">
          <thead>
            <tr>
              <th />
              {demanda.map((_, indice) => (
                <th key={`col-${indice}`}>Origen {indice + 1}</th>
              ))}
              <th>Oferta</th>
            </tr>
          </thead>
          <tbody>
            {matrizCostos.map((filaCostos, fila) => (
              <tr key={`fila-${fila}`}>
                <th>Destino {fila + 1}</th>
                {filaCostos.map((valor, columna) => (
                  <td key={`celda-${fila}-${columna}`}>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      inputMode="decimal"
                      className="transporte-input"
                      value={formatNumber(valor)}
                      onChange={(evento) => onChangeCosto(fila, columna, evento.target.value)}
                    />
                  </td>
                ))}
                <td>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    inputMode="decimal"
                    className="transporte-input"
                    value={formatNumber(oferta[fila])}
                    onChange={(evento) => onChangeOferta(fila, evento.target.value)}
                  />
                </td>
              </tr>
            ))}
            <tr>
              <th>Demanda</th>
              {demanda.map((valor, indice) => (
                <td key={`demanda-${indice}`}>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    inputMode="decimal"
                    className="transporte-input"
                    value={formatNumber(valor)}
                    onChange={(evento) => onChangeDemanda(indice, evento.target.value)}
                  />
                </td>
              ))}
              <td className="transporte-tipo-problema">
                {tipoProblema}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="transporte-actions">
        <div className="transporte-actions-group">
          <button type="button" onClick={onAgregarFila}>
            Agregar Fila
          </button>
          <button type="button" onClick={onEliminarFila} disabled={!puedeEliminarFila}>
            Eliminar Fila
          </button>
          <button type="button" onClick={onAgregarColumna}>
            Agregar Columna
          </button>
          <button type="button" onClick={onEliminarColumna} disabled={!puedeEliminarColumna}>
            Eliminar Columna
          </button>
        </div>
        <div className="transporte-actions-group">
          <button type="button" className="transporte-reset" onClick={onResetear}>
            Resetear
          </button>
          <button
            type="button"
            className="transporte-calcular"
            onClick={onCalcular}
          >
            Calcular Solución
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatrizEntrada;
