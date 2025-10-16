import React from 'react';
import Joyride from 'react-joyride';

const SortTourGuide = ({ run, onTourEnd }) => {
    const steps = [
        {
            target: '#tour-step-1',
            content: 'Aquí puedes configurar cómo se generan los números. Elige entre "Aleatorio" o "Manual".',
            placement: 'right',
        },
        {
            target: '#tour-step-2',
            content: 'En esta sección, selecciona el algoritmo y las acciones principales como "Generar", "Reset", "Repetir".',
            placement: 'right',
        },
        {
            target: '#tour-step-3',
            content: 'Elige uno de los algoritmos de ordenamiento disponibles en esta lista.',
            placement: 'bottom',
        },
        {
            target: '#tour-step-4',
            content: 'Aquí puedes importar o exportar tus listas de números.',
            placement: 'left',
        },
        {
            target: '#tour-step-5',
            content: 'Una vez que todo esté listo, haz clic aquí para iniciar la simulación visual. Durante la simulación, puedes pausar o reanudar la animación en cualquier momento.',
            placement: 'left',
        },
        {
            target: '#tour-step-6',
            content: 'Puedes volver a ver este tour en cualquier momento haciendo clic en este botón.',
            placement: 'left',
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
                    arrowColor: '#2E3B4E',
                    backgroundColor: '#F1F1F1',
                    primaryColor: '#00F9A0',
                    textColor: '#1A1A2E',
                    zIndex: 1000,
                }
            }}
        />
    );
};

export default SortTourGuide;