import React, {useCallback } from 'react'; 
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
    description: '(Próximamente)',
    enabled: false,
  },
  {
    title: 'Sort',
    img: process.env.PUBLIC_URL + 'IMG/img_sort.png',
    description: '(Próximamente)',
    enabled: false,
  },
];

const HomePage = ({ onNavigate,onGoBack}) => {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

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
        <div className="modules-grid">
          {modules.map((mod) => (
            <ElectricBorderCard key={mod.title} enabled={mod.enabled}>
              <h3 style={{ textAlign: 'center' }}>{mod.title}</h3>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0px 0' }}>
                <img src={mod.img} alt={mod.title + ' icon'} style={{ width: '250px', height: '250px', objectFit: 'contain' }} />
              </div>
              <p style={{ textAlign: 'center' }}>{mod.description}</p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => mod.enabled && onNavigate(mod.targetView)}
                  disabled={!mod.enabled}
                >
                  START
                </button>
              </div>
            </ElectricBorderCard>
          ))}
        </div>
      </div>
      <div className="welcome-nav bottom-right"> 
        <button onClick={onGoBack}>Retroceder</button>
      </div>
    </div>
  );
};

export default HomePage;