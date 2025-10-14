import React, { useState } from 'react';
import InfoModal from './InfoModal'; 

// Datos de las constelaciones y algoritmos asociados
const constellationsData = [
    { 
      id: 'andromeda', 
      name: 'Andrómeda', 
      concept: 'Insertion Sort', 
      info: '✨ Ordena un universo de estrellas una por una. Cada nueva estrella viaja a través de las ya ordenadas hasta encontrar su órbita correcta.',
      img: process.env.PUBLIC_URL + 'IMG/constelations/andromeda.jpg',
    },
    { 
      id: 'orion', 
      name: 'Orión', 
      concept: 'Selection Sort', 
      info: '🔭 Escanea todo el cosmos buscando la estrella más pequeña y la coloca al principio de la galaxia. Repite el proceso hasta que todas las estrellas están en su lugar.',
      img: process.env.PUBLIC_URL + 'IMG/constelations/orion.jpg',
    },
    { 
      id: 'gemini', 
      name: 'Géminis', 
      concept: 'Merge Sort', 
      info: '🌌 Divide la galaxia en dos mitades, y luego cada mitad en otras dos, hasta tener estrellas individuales. Después, fusiona estos pequeños sistemas estelares de forma ordenada, creando una única galaxia perfectamente alineada.',
      img: process.env.PUBLIC_URL + 'IMG/constelations/geminis.jpg',
    },
    { 
      id: 'pegasus', 
      name: 'Pegaso', 
      concept: 'Shell Sort', 
      info: '🚀 Una versión supercargada de Insertion Sort que usa "saltos hiperespaciales". Compara y ordena estrellas que están muy lejos entre sí, reduciendo la distancia de los saltos en cada pasada hasta que el orden es perfecto.',
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