import React from 'react';
import Joyride from 'https://cdn.skypack.dev/react-joyride';

const TreeTourGuide = ({ run, onTourEnd }) => {
    const steps = [
        {
            target: '#tour-tree-step-1',
            content: 'Estos son los botones para iniciar la animación de los recorridos del árbol: In-Order, Post-Order y Pre-Order.',
            placement: 'bottom',
        },
        {
            target: '#tour-tree-step-2',
            content: 'Aquí puedes elegir cómo crear el árbol. "Aleatorio" para generar nodos automáticamente o "Manual" para insertarlos uno por uno.',
            placement: 'right',
        },
        {
            target: '#tour-tree-step-3',
            content: 'Si eliges "Aleatorio", puedes definir la cantidad de nodos y el rango de sus valores (mínimo y máximo). Luego presiona "Generar".',
            placement: 'right',
        },
        {
            target: '#tour-tree-step-4',
            content: 'Si estás en modo "Manual", usa este botón para abrir una ventana e insertar un nuevo nodo en el árbol.',
            placement: 'right',
        },
        {
            target: '#tour-tree-step-5',
            content: 'Usa estos botones para importar un árbol desde un archivo .json, exportar el árbol actual, o resetear el simulador.',
            placement: 'left',
        },
        {
            target: '#tour-tree-step-6',
            content: 'Aquí verás la secuencia de nodos visitados en tiempo real durante la animación del recorrido. ',
            placement: 'top',
        },
        {
            target: '#tour-tree-step-7',
            content: 'Esta es el área principal donde se visualizará la estructura del árbol y la animación del recorrido.',
            placement: 'top',
        },
        {
            target: '#tour-tree-step-8',
            content: 'Puedes volver a ver este tour en cualquier momento haciendo clic en este botón de ayuda.',
            placement: 'right',
        }
    ];

    return (
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
                    arrowColor: '#2C3E50', // azul-nebulosa
                    backgroundColor: '#E5E5E5', // blanco-estelar
                    primaryColor: '#27AE60', // verde-galactico
                    textColor: '#121212', // negro-cosmico
                    zIndex: 1000,
                }
            }}
        />
    );
};

export default TreeTourGuide;