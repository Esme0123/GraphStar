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
    { id: 'neptuno', name: 'Neptuno', info: 'Información sobre Neptuno próximamente...',size:110 },
    { id: 'urano', name: 'Urano', info: 'Información sobre Urano próximamente...', size:100 },
    { id: 'saturno', name: 'Saturno', info: 'Información sobre Saturno próximamente...',size:130 },
    { id: 'jupiter', name: 'Júpiter', info: 'Información sobre Júpiter próximamente...' , size:140},
    { id: 'marte', name: 'Marte', info: 'Información sobre Marte próximamente...' ,size:70},
    { id: 'tierra', name: 'Tierra',concept:'Matriz de adyacencia', info: 'La Matriz de Adyacencia es una tabla que muestra qué nodos están conectados entre sí. Es una forma matemática de ver tu universo.',size:80 },
    { id: 'venus', name: 'Venus',concept:'Arista', info: 'Una Arista (o arco) conecta dos nodos. Representa una relación o conexión entre ellos. Pueden tener un valor y una dirección.',size:75 },
    { id: 'mercurio', name: 'Mercurio',concept:'Nodo', info: 'Un Nodo (o vértice) es la unidad fundamental de la que están formados los grafos. ¡En nuestro universo, son planetas!',size:60 },
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