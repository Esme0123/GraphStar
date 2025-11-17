import React, {useCallback, useEffect, useRef } from 'react'; 
import Particles from 'react-tsparticles'; 
import { loadSlim } from 'tsparticles-slim'; 
import particlesConfig from '../particles-config';
import ElectricBorderCard from './ElectricBorderCard';

const modules = [
  {
    title: 'Grafos',
    img: process.env.PUBLIC_URL + 'IMG/img_grafo.png',
    description: 'Crea y analiza universos de nodos y conexiones. Encuentra los caminos más cortos y largos entre planetas.',
    enabled: true,
    targetView: 'welcome',
  },
  {
    title: 'NorthWest',
    img: process.env.PUBLIC_URL + 'IMG/img_northwest.png',
    description: 'Construye la matriz del problema, aplica la regla Norwest y optimiza con MODI paso a paso.',
    enabled: true,
    targetView: 'norwest',
  },
  {
    title: 'Sort',
    img: process.env.PUBLIC_URL + 'IMG/img_sort.png',
    description: 'Los algoritmos de ordenamiento dan forma al caos de los datos. Cada uno sigue su propio patrón para organizar el universo numérico, como constelaciones que revelan armonía en el cielo de GraphStar.',
    enabled: true,
    targetView: 'welcomeSort',
  },
  {
    title: 'Tree',
    img: process.env.PUBLIC_URL + 'IMG/img_tree.png',
    description: 'Explora estructuras jerárquicas donde cada decisión abre nuevos caminos. Los árboles revelan la lógica oculta detrás de elecciones eficientes, búsquedas rápidas y estructuras que se ramifican como raíces cósmicas en GraphStar',
    enabled: true,
    targetView: 'welcomeTrees',
  },
  {
    title: 'MathLab',
    img: process.env.PUBLIC_URL + 'IMG/img_mathlab.png',
    description: 'Cami y Franco',
    enabled: false,
  },
];

const HomePage = ({ onNavigate,onGoBack}) => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const viewportRef = useRef(null)

  useEffect(() => {
    const container = viewportRef.current
    if(!container) return
    const handleWheel = (e) => {
    e.preventDefault()
    const scrollAmount = e.deltaY
    container.scrollLeft += scrollAmount
  }
  container.addEventListener('wheel', handleWheel, {passive:false})

  return () => {
    container.removeEventListener('wheel', handleWheel)
  }

  }, [])

  return (
    <div className="home-page-container">
      {}
      <Particles
        id="tsparticles"
        options={particlesConfig}
        init={particlesInit}
      />
      
      <div className="home-content">
        <h1 className="home-title">Escoge tu destino</h1>
        <h2 className="home-subtitle">Selecciona un módulo para comenzar tu viaje</h2>
        <div className="modules-viewport" ref={viewportRef}>
          
          <div className="modules-grid modules-track">
            {modules.map((mod) => (
              <ElectricBorderCard key={mod.title} enabled={mod.enabled}>
                <h3 className='card-title'>{mod.title}</h3>
                <div className='card-image-wrapper'>
                  <img src={mod.img} alt={mod.title + ' icon'} className='card-image' />
                </div>
                <p className='card-description'>{mod.description}</p>
                <div className='card-actions'>
                  <button
                    onClick={() => mod.enabled && onNavigate(mod.targetView)}
                    disabled={!mod.enabled}
                  >
                    START
                  </button>
                </div>
              </ElectricBorderCard>
            ))}
            {/*Clones para efecto infinito*/}
            {modules.map((mod) => (
              <ElectricBorderCard key={`${mod.title}-clone`} enabled={mod.enabled} aria-hidden="true">
                <h3 className='card-title'>{mod.title}</h3>
                <div className='card-image-wrapper'>
                  <img src={mod.img} alt={mod.title + ' icon'} className='card-image' />
                </div>
                <p className='card-description'>{mod.description}</p>
                <div className='card-actions'>
                  <button
                    onClick={() => mod.enabled && onNavigate(mod.targetView)}
                    disabled={!mod.enabled}
                    tabIndex={-1} 
                  >
                    START
                  </button>
                </div>
              </ElectricBorderCard>
            ))}

          </div>
        </div>
      </div>
      <div className="welcome-nav bottom-right"> 
        <button onClick={onGoBack}>Retroceder</button>
      </div>
    </div>
  );
};

export default HomePage;