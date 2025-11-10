import React from 'react';
import Joyride from 'react-joyride';

const steps = [
  {
    target: '#northwest-tour-tabs',
    content: 'Visualiza la Matriz de Entrada, la Solución final y las Iteraciones de la solución utilizando estas pestañas.',
    placement: 'bottom',
  },
  {
    target: '#northwest-tour-balance',
    content: 'Aquí se muestran los totales de oferta y demanda junto con su diferencia. Úsalo para confirmar que tus datos estén equilibrados.',
    placement: 'left',
  },
  {
    target: '#northwest-tour-import',
    content: 'Puedes importar un problema existente en formato JSON o CSV, o exportar la configuración actual para reutilizarla más adelante.',
    placement: 'bottom',
  },
  {
    target: '#northwest-tour-table',
    content: 'Edita los costos unitarios, la oferta y la demanda directamente en esta matriz. Las celdas marcadas como Balance se bloquean automáticamente cuando es necesario equilibrar.',
    placement: 'top',
  },
  {
    target: '#northwest-tour-actions',
    content: 'Usa estos botones para agregar/eliminar filas o columnas y para resetear la matriz a su estado inicial.',
    placement: 'top',
  },
  {
    target: '#northwest-tour-calc',
    content: 'Cuando la matriz esté lista, presiona “Calcular Solución” para obtener la asignación óptima y navegar a la pestaña Solución.',
    placement: 'left',
  },
  {
    target: '#northwest-tour-help',
    content: 'Haz clic en este botón en cualquier momento para volver a ver esta guía interactiva.',
    placement: 'left',
  },
];

  const NorthwestTourGuide = ({ run, onTourEnd }) => (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={({ status }) => {
        if (['finished', 'skipped'].includes(status)) {
          onTourEnd();
        }
      }}
      styles={{
        options: {
          arrowColor: '#1f2b3c',
          backgroundColor: '#f0f0f5ee',
          primaryColor: '#00f9a0',
          textColor: '#182033',
          zIndex: 1500,
        },
      }}
    />
  );

export default NorthwestTourGuide;
