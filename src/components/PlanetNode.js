import React from 'react';
import { Handle, Position } from 'reactflow';

const PlanetNode = ({ data }) => {
    const nodeStyle = {
        width: `${data.size || 80}px`,
        height: `${data.size || 80}px`,
        background: `radial-gradient(circle at 20% 20%, ${data.color || '#6A4C93'}, var(--azul-nebuloso))`,
        border: `3px solid ${data.borderColor || 'var(--amarillo-estrella)'}`,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '16px',
    };

    return (
        <div style={{ position: 'relative' }}>
            <div className="planet-node" style={nodeStyle}>
                <Handle type="source" position={Position.Top} id="a" />
                <Handle type="source" position={Position.Right} id="b" />
                <Handle type="source" position={Position.Bottom} id="c" />
                <Handle type="source" position={Position.Left} id="d" />
                {data.label}
            </div>
            <div className="node-costs-container">
                {data.forwardCost !== undefined && (
                    <div className="node-cost forward-cost">
                        {data.forwardCost.toFixed(2)}
                    </div>
                )}
                {data.backwardCost !== undefined && (
                    <div className="node-cost backward-cost">
                        {data.backwardCost.toFixed(2)}
                    </div>
                )}
            </div>
            {data.cumulativeCost !== undefined && (
                <div className="cumulative-cost-label">
                    {/* Si estamos maximizando, revertimos el signo para mostrarlo bien */}
                    {(data.isMaximize ? -1 * data.cumulativeCost : data.cumulativeCost).toFixed(2)}
                </div>
            )}
        </div>
    );
};

export default PlanetNode;