import React from 'react';
import { Handle, Position } from 'reactflow';

const PlanetNode = ({ data }) => {
    const nodeStyle = {
        width: `${data.size || 80}px`,
        height: `${data.size || 80}px`,
        background: `radial-gradient(circle at 20% 20%, ${data.color || '#6A4C93'}, var(--azul-nebuloso))`,
        border: `3px solid ${data.borderColor || 'var(--amarillo-estrella)'}`
    };

    return (
        <div className="planet-node" style={nodeStyle}>
            <Handle type="source" position={Position.Top} id="a" />
            <Handle type="source" position={Position.Right} id="b" />
            <Handle type="source" position={Position.Bottom} id="c" />
            <Handle type="source" position={Position.Left} id="d" />
            {data.label}
        </div>
    );
};

export default PlanetNode;