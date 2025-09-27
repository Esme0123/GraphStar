import React, { useCallback } from 'react'; 
import Particles from 'react-tsparticles'; 
import { loadSlim } from 'tsparticles-slim'; 
import particlesConfig from '../particles-config';
import ElectricBorderCard from './ElectricBorderCard';

const modules = [
  {
    title: 'Grafos',
    description: 'Crea y analiza universos de nodos y conexiones. Encuentra los caminos más cortos y largos entre planetas.',
    enabled: true,
    targetView: 'welcome',
  },
  {
    title: 'NorthWest',
    description: '(Próximamente)',
    enabled: false,
  },
  {
    title: 'Sort',
    description: '(Próximamente)',
    enabled: false,
  },
];

const HomePage = ({ onNavigate }) => {
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
              <h3>{mod.title}</h3>
              <p>{mod.description}</p>
              <button
                onClick={() => mod.enabled && onNavigate(mod.targetView)}
                disabled={!mod.enabled}
              >
                START
              </button>
            </ElectricBorderCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;