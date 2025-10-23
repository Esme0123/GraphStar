import React, { useState, useEffect } from 'react';
import useTransporte from '../hooks/useTransporte';
import MatrizEntrada from './MatrizEntrada';
import SolucionVista from './SolucionVista';
import IteracionesVista from './IteracionesVista';
import NorthwestTourGuide from './NorthwestTourGuide';
import './TransportePage.css';

const TABS = [
  { id: 'entrada', label: 'Matriz de Entrada' },
  { id: 'solucion', label: 'Solución' },
  { id: 'iteraciones', label: 'Iteraciones' },
];

const TransportePage = ({ onGoBack, showTutorial }) => {
  const [tabActiva, setTabActiva] = useState('entrada');
  const [iteracionActual, setIteracionActual] = useState(0);
  const [runTour, setRunTour] = useState(false);

  const {
    matrizCostos,
    oferta,
    demanda,
    tipoProblema,
    totalOferta,
    totalDemanda,
    resultado,
    error,
    limpiarError,
    actualizarCosto,
    actualizarOferta,
    actualizarDemanda,
    agregarFila,
    eliminarFila,
    agregarColumna,
    eliminarColumna,
    resetear,
    calcularSolucion,
    cambiarTipoProblema,
    importarJSON,
    importarCSV,
    exportarJSON,
    exportarCSV,
    puedeEliminarFila,
    puedeEliminarColumna,
    balanceAutomatico,
  } = useTransporte();

  useEffect(() => {
    const visto = typeof window !== 'undefined' ? localStorage.getItem('northwestTourSeen') : 'true';
    if (!visto) {
      setRunTour(true);
      localStorage.setItem('northwestTourSeen', 'true');
    }
  }, []);

  useEffect(() => {
    if (resultado?.procesoIteraciones?.length) {
      setIteracionActual(0);
    }
  }, [resultado]);

  const handleCalcular = () => {
    const exito = calcularSolucion();
    if (exito) {
      setTabActiva('solucion');
    }
  };

  const handleCambioTab = (id) => {
    if (id !== 'entrada' && !resultado) {
      return;
    }
    setTabActiva(id);
  };

  const alternarTipoProblema = () => {
    cambiarTipoProblema(tipoProblema === 'Minimizar' ? 'Maximizar' : 'Minimizar');
  };

  const puedeVerSolucion = Boolean(resultado);
  const puedeVerIteraciones = Boolean(resultado?.procesoIteraciones?.length);

  return (
    <div className="transporte-page">
      <div className="transporte-container">
        <NorthwestTourGuide run={runTour} onTourEnd={() => setRunTour(false)} />
        <button
          id="northwest-tour-help"
          type="button"
          className="help-button"
          title="Mostrar guía interactiva"
          onClick={() => setRunTour(true)}
        >
          ?
        </button>
        <header className="transporte-header">
          <div className="transporte-header-left">
            <button type="button" className="transporte-back" onClick={onGoBack}>
              Volver
            </button>
            <div>
              <h1>Northwest Solver</h1>
              <p className="transporte-descripcion">
                Resolver interactivo para el Problema de Transporte.
              </p>
            </div>
          </div>
          <div className="transporte-header-actions">
            <div className="transporte-toggle">
              <span>Minimizar</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={tipoProblema === 'Maximizar'}
                  onChange={alternarTipoProblema}
                />
                <span className="slider" />
              </label>
              <span>Maximizar</span>
            </div>
            {showTutorial && (
              <button
                type="button"
                className="transporte-tutorial"
                onClick={() => showTutorial('northwest')}
              >
                Tutorial
              </button>
            )}
          </div>
        </header>

        <nav className="transporte-tabs" id="northwest-tour-tabs">
          {TABS.map((tab) => {
            const disabled = tab.id !== 'entrada' && !resultado;
            const active = tabActiva === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                className={`tab-button ${active ? 'is-active' : ''}`}
                onClick={() => handleCambioTab(tab.id)}
                disabled={disabled}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        <section className="transporte-section">
          {tabActiva === 'entrada' && (
            <MatrizEntrada
              matrizCostos={matrizCostos}
              oferta={oferta}
              demanda={demanda}
              tipoProblema={tipoProblema}
              totalOferta={totalOferta}
              totalDemanda={totalDemanda}
              puedeEliminarFila={puedeEliminarFila}
              puedeEliminarColumna={puedeEliminarColumna}
              onChangeCosto={actualizarCosto}
              onChangeOferta={actualizarOferta}
              onChangeDemanda={actualizarDemanda}
              onAgregarFila={agregarFila}
              onEliminarFila={eliminarFila}
              onAgregarColumna={agregarColumna}
              onEliminarColumna={eliminarColumna}
              onResetear={resetear}
              onCalcular={handleCalcular}
              onImportarJSON={importarJSON}
              onImportarCSV={importarCSV}
              onExportarJSON={exportarJSON}
              onExportarCSV={exportarCSV}
              error={error}
              onCerrarError={limpiarError}
              balanceAutomatico={balanceAutomatico}
            />
          )}

          {tabActiva === 'solucion' && (
            <SolucionVista resultado={resultado} tipoProblema={tipoProblema} />
          )}

          {tabActiva === 'iteraciones' && (
            <IteracionesVista
              resultado={resultado}
              iteracionActual={iteracionActual}
              onCambiarIteracion={setIteracionActual}
            />
          )}

          {!puedeVerSolucion && tabActiva !== 'entrada' && (
            <p className="transporte-help-text">
              Completa la matriz y presiona <strong>Calcular Solución</strong> para habilitar las
              pestañas de Solución e Iteraciones.
            </p>
          )}

          {tabActiva === 'solucion' && !puedeVerSolucion && (
            <p className="transporte-help-text">
              Aún no hay una solución calculada.
            </p>
          )}

          {tabActiva === 'iteraciones' && !puedeVerIteraciones && (
            <p className="transporte-help-text">
              Aún no hay iteraciones disponibles. Calcula la solución primero.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default TransportePage;
