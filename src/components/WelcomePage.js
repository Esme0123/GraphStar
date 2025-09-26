import React, { useState, useEffect } from 'react';
import InfoModal from './InfoModal';
const planetImages = {
    mercurio: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg', 
    venus: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Venus_globe.jpg', 
    tierra: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/250px-The_Earth_seen_from_Apollo_17.jpg', 
    marte: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/250px-OSIRIS_Mars_true_color.jpg', 
    jupiter: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/250px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg', 
    saturno: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/250px-Saturn_during_Equinox.jpg', 
    urano: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/250px-Uranus2.jpg',
    neptuno: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg', 
};
const planetsData = [
    { id: 'neptuno', name: 'Neptuno', concept: '🛠️ Algoritmo de Kruskal',info: '🔗 El algoritmo de Kruskal encuentra el árbol de expansión mínima 🌲 en un grafo, es decir, la forma más eficiente de conectar todos los planetas con la menor cantidad de energía (peso total más bajo). Ordena todas las rutas (aristas 🚀) y las va eligiendo sin formar ciclos hasta conectar todos los nodos 🌍.',size:120 },
    { id: 'urano', name: 'Urano',concept:'🛰️ Algoritmo Dijkstra', info: '📡 Dijkstra es un algoritmo que encuentra el camino más corto entre un planeta de origen 🌍 y todos los demás. Calcula la ruta óptima 🚀 tomando en cuenta el peso (distancia, tiempo, energía ⚡️). Funciona solo con pesos positivos y es ideal para encontrar caminos seguros y eficientes en la red galáctica.', size:110 },
    { id: 'saturno', name: 'Saturno',concept:'🎯 Algoritmo de Asignación', info: '🔄 El algoritmo de asignación busca emparejar elementos de dos conjuntos (como naves y misiones 🚀🪐) de forma óptima para minimizar el costo total o maximizar la eficiencia. Imagina que cada nave tiene que ir al planeta ideal según su capacidad: este algoritmo lo resuelve inteligentemente 🧠.',size:150 },
    { id: 'jupiter', name: 'Júpiter', concept:'🌀 Algoritmo de Johnson',info: '🌀 Es un potente algoritmo para encontrar los caminos más cortos entre todos los pares de planetas 🌍🌍, incluso si hay rutas con pesos negativos ⚠️. Transforma los pesos para que luego se pueda usar el veloz algoritmo de Dijkstra. También detecta ciclos negativos para evitar resultados infinitos 🔁.' , size:150},
    { id: 'marte', name: 'Marte',concept:'🗺️ Grafo', info: '🗺️ Un grafo es como un mapa galáctico que representa todo un sistema de planetas (🌍 nodos) y las rutas espaciales (🚀 aristas) que los conectan. Es la estructura completa que usan las naves para planear viajes, explorar o comerciar. Puede ser dirigido (➡️) o no dirigido (🔁), y las rutas pueden tener pesos que indican distancia, tiempo o energía.' ,size:80},
    { id: 'tierra', name: 'Tierra',concept:'📊 Matriz de adyacencia', info: '📊 La matriz de adyacencia es como un mapa estelar codificado que muestra qué planetas están conectados entre sí. Es una tabla donde:\n- Cada fila y columna representa un planeta 🪐\n- Un 1 (o un número) indica una conexión 🚀\n- Un 0 indica que no hay ruta ❌\nEs muy útil para que las computadoras interpreten la red galáctica y calculen rutas y distancias.',size:90 },
    { id: 'venus', name: 'Venus',concept:'🚀 Arista', info: '🚀 Una arista es una ruta interplanetaria que conecta dos planetas (nodos). Puede ser:\n- Dirigida (🌠): la nave solo puede viajar en un sentido (ej. Marte ➡️ Venus)\n- No dirigida (🔁): se puede ir y volver\nSi la arista tiene un peso, este puede representar la distancia, tiempo de viaje o consumo de energía ⚡️.',size:85 },
    { id: 'mercurio', name: 'Mercurio',concept:'🌍 Nodo', info: '🌍 Un nodo representa un planeta dentro del universo del grafo. Cada planeta es una entidad única que puede conectarse con otros mediante rutas espaciales (aristas 🚀). Pueden tener nombres como Marte, Júpiter o Vega-7 y mostrar datos como recursos 🪨 o características. Visualmente, cada nodo es un cuerpo celeste en la red galáctica ✨.',size:70 },
];

const WelcomePage = ({ onGoToEditor, onGoBack }) => {
    const [step, setStep] = useState('prompt'); 
    const [activePlanet, setActivePlanet] = useState(null);

    useEffect(() => {
        if (step === 'thanks') {
            const timer = setTimeout(() => {
                setStep('main');
            }, 3000); 
            return () => clearTimeout(timer);
        }
    }, [step]);

    const handleAccept = () => {
        setStep('thanks');
    };

    const handlePlanetClick = (planet) => {
        setActivePlanet(planet);
    };

    return (
        <div className="welcome-page">
            {step === 'prompt' && (
                <div className="welcome-prompt">
                    <h2>¡Bienvenido a GraphStar! ✨</h2>
                    <p>Este es un tour rápido por las funciones principales. ¿Deseas continuar?</p>
                    <div className="prompt-buttons">
                        
                        <button onClick={handleAccept}>Aceptar</button>
                        <button onClick={onGoToEditor}>Cancelar</button>
                    </div>
                </div>
            )}

            {step === 'thanks' && (
                <div className="welcome-prompt thanks">
                    <h2>¡Gracias por aceptar!</h2>
                    <p>El tour comenzará en unos segundos...</p>
                </div>
            )}
            
            {step === 'main' && (
                <>
                    <div className="welcome-nav top-right">
                        <button onClick={onGoToEditor}>Ir al Editor 🚀</button>
                    </div>

                    <div className="planet-system">
                        <h1 className="explore-title">Explora las Funciones</h1>
                        <div className="planets-container"> {}
                            {planetsData.map(planet => (
                                <div key={planet.id} className="planet-item" onClick={() => handlePlanetClick(planet)}>
                                    <img src={planetImages[planet.id]} alt={planet.name} className="planet-image" style={{ width: planet.size, height: planet.size }} />
                                    <span className="planet-name">{planet.name}</span>
                                    {planet.concept && <span className="planet-concept">{planet.concept}</span>} {}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="welcome-nav bottom-right"> {/* Clase para posicionar */}
                        <button onClick={onGoBack}>Retroceder</button>
                    </div>
                </>
            )}

            <InfoModal planet={activePlanet} onClose={() => setActivePlanet(null)} />
        </div>
    );
};

export default WelcomePage;