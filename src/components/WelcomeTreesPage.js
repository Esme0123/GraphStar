import React, { useState } from 'react';
import InfoModal from './InfoModal';
// TIPOS DE RECORRIDOS DE ARBOLES
const astrosData = [
    {
      id: 'cometaGuia',
      name: 'Cometa Guía',
      concept: 'PRE ORDER ',
      info: '🚀 El cometa parte desde el nodo raíz, dejando su estela en cada planeta que visita antes de desviarse a las órbitas izquierdas y derechas. Ideal para clonar galaxias o evaluar expresiones. \n\nOrden de visita: Raíz → Izquierda → Derecha.',
      img: process.env.PUBLIC_URL + 'IMG/astros_Trees/preOrden_cometaGuia.png',
    },
    {
      id: 'sistemaBinario',
      name: 'SistemaBinario',
      concept: 'IN ORDER ',
      info: '🔭 El sistema analiza primero el lado izquierdo del universo, luego observa la estrella principal (raíz) y finalmente explora el lado derecho. Es el método favorito para obtener datos ordenados en árboles binarios de búsqueda.\n\nOrden de visita: Izquierda → Raíz → Derecha.',
      img: process.env.PUBLIC_URL + 'IMG/astros_Trees/inOrden_sistemaBinario.png',
    },
    {
      id: 'supernova',
      name: 'Supernova',
      concept: 'POST ORDER',
      info: '💥 Como una supernova que colapsa todo a su alrededor, este recorrido explora primero los extremos del universo y deja la raíz para el final. Útil para eliminar estructuras o evaluar árboles de sintaxis.\n\nOrden de visita: Izquierda → Derecha → Raíz.',
      img: process.env.PUBLIC_URL + 'IMG/astros_Trees/post_Supernova.png',
    }
];
const WelcomeTreesPage = ({ onGoToSimulator, onGoBack }) => {
    const [activeConstellation, setActiveConstellation] = useState(null);

    return (
        <div className="welcome-page">
            <div className="welcome-nav top-right">
                <button onClick={onGoToSimulator}> EXPLORAR 🚀</button>
            </div>

            <div className="astros-system">
                <h1 className="explore-title">Conceptos de Ordenamiento</h1>
                <div className="astros-grid">
                    {astrosData.map(item => (
                        <div key={item.id} className="astros-item" onClick={() => setActiveConstellation(item)}>
                            <img src={item.img} alt={item.name} className="astros-image" />
                            <span className="astros-name">{item.name}</span>
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

export default WelcomeTreesPage;