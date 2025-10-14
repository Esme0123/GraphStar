import React, { useState } from 'react';
import InfoModal from './InfoModal'; 

// Datos de las constelaciones y algoritmos asociados
const constellationsData = [
    { 
      id: 'andromeda', 
      name: 'Andrómeda', 
      concept: 'Insertion Sort', 
      info: 'Funciona construyendo una secuencia ordenada un elemento a la vez. Es como ordenar una mano de cartas: tomas una carta y la insertas en su posición correcta entre las que ya tienes ordenadas.',
      img: process.env.PUBLIC_URL + 'IMG/constelations/andromeda.jpg',
    },
    { 
      id: 'orion', 
      name: 'Orión', 
      concept: 'Selection Sort', 
      info: 'Busca repetidamente el elemento más pequeño de la parte no ordenada de la lista y lo mueve al principio. Es como si buscaras al estudiante más bajo de una fila y lo pusieras al frente, una y otra vez.',
      img: process.env.PUBLIC_URL + 'IMG/constelations/orion.jpg',
    },
    { 
      id: 'gemini', 
      name: 'Géminis', 
      concept: 'Merge Sort', 
      info: 'Es un algoritmo de "divide y vencerás". Divide la lista a la mitad repetidamente hasta tener listas de un solo elemento. Luego, las combina (merge) de forma ordenada hasta tener una sola lista final.',
      img: process.env.PUBLIC_URL + 'IMG/constelations/geminis.jpg',
    },
    { 
      id: 'pegasus', 
      name: 'Pegaso', 
      concept: 'Shell Sort', 
      info: 'Es una versión mejorada del Insertion Sort. Permite el intercambio de elementos que están lejos uno del otro. Ordena sub-listas de elementos a intervalos decrecientes, haciéndolo más rápido en muchos casos.',
      img: process.env.PUBLIC_URL + 'IMG/constelations/pegaso.jpg',
    }
];

const WelcomeSortPage = ({ onGoToSimulator, onGoBack }) => {
    const [activeConstellation, setActiveConstellation] = useState(null);

    return (
        <div className="welcome-page">
            <div className="welcome-nav top-right">
                <button onClick={onGoToSimulator}>Ir al Simulador 🚀</button>
            </div>

            <div className="constellation-system">
                <h1 className="explore-title">Conceptos de Ordenamiento</h1>
                <div className="constellations-grid">
                    {constellationsData.map(item => (
                        <div key={item.id} className="constellation-item" onClick={() => setActiveConstellation(item)}>
                            <img src={item.img} alt={item.name} className="constellation-image" />
                            <span className="constellation-name">{item.name}</span>
                            <span className="constellation-concept">{item.concept}</span>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="welcome-nav bottom-right">
                <button onClick={onGoBack}>Retroceder</button>
            </div>

            <InfoModal planet={activeConstellation} onClose={() => setActiveConstellation(null)} />
        </div>
    );
};

export default WelcomeSortPage;