import React from 'react';
import Joyride, { STATUS } from 'react-joyride';

const TOUR_STEPS = [
    {
        target: '.sidebar-container',
        content: '¡Bienvenido a GraphStar! Aquí encontrarás todas las herramientas para crear y gestionar tu universo de grafos.',
        placement: 'right'
    },
    {
        target: '#btn-add-node',
        content: 'Haz clic aquí para añadir un "planeta" (nodo) a tu universo. Se creará en el centro de la pantalla.',
        placement: 'right'
    },
    {
        target: '.react-flow__pane',
        content: 'Puedes hacer doble clic sobre cualquier planeta para editar su nombre, tamaño y color.',
        placement: 'center'
    },
    {
        target: '#btn-add-edge',
        content: 'Usa este botón para activar el modo "Crear arista" y puedes escoger entre tres tipos: curva, recta y suave. Luego, haz clic en un planeta de origen y otro de destino para unirlos, también puedes dibujar una arista manualmente.',
        placement: 'right'
    },
    {
        target: '.react-flow__pane',
        content: 'Puedes hacer doble clic sobre cualquier arista para editar su peso y color.',
        placement: 'center'
    },
    {
        target: '#cb-directed',
        content: 'Marca esta casilla si quieres que tus conexiones (aristas) tengan una dirección (grafo dirigido).',
        placement: 'right'
    },
    {
        target: '#btn-show-matrix',
        content: 'Cuando tengas tu grafo listo, presiona aquí para generar y visualizar su Matriz de Adyacencia.',
        placement: 'right'
    },
    {
        target: '#btn-delete',
        content: 'Selecciona un planeta (nodo) y haz clic aquí para eliminarlo, se eliminará el nodo junto con las conexiones que tiene.',
        placement: 'right'
    },
    {
        target: '#btn-reset',
        content: 'Puedes limpiar tu pizarra solar de una sola vez si así lo requieres, haciendo click en este botón.',
        placement: 'right'
    },
    {
        target: '#btn-save',
        content: 'Guarda tu universo en un archivo JSON para poder cargarlo más tarde.',
        placement: 'right'
    },
    {
        target: '#btn-load',
        content: '¿Ya tienes un universo guardado? Cárgalo desde aquí.',
        placement: 'right'
    },
    {
        target: '#btn-simulation-bar',
        content:'En está sección puedes simular con el algoritmo. Primero selecciona el algoritmo, luego selecciona si minimizar o maximizar, después realiza lo indicado según el algoritmo y por último presiona Calcular',
        placement: 'right'
    },
    {
        target: '.help-button',
        content: 'Si olvidas cómo funciona algo, siempre puedes volver a ver este tutorial haciendo clic en este botón. ¡Disfruta creando!',
        placement: 'bottom'
    }
];

const TourGuide = ({ run, onTourEnd, steps = TOUR_STEPS }) => {
    const handleJoyrideCallback = (data) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            onTourEnd();
        }
    };

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            showProgress
            showSkipButton
            callback={handleJoyrideCallback}
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

export default TourGuide;
