import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from 'reactflow';

const PathWithSlackEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  label,
  markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      {}
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} />
      
      <EdgeLabelRenderer>
        {/* holgura arriba*/}
        {data?.slack !== undefined && (
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -150%) translate(${labelX}px,${labelY}px)`, // -150% para subirla
              background: 'var(--morado)',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: 12,
              fontWeight: 'bold',
              color: 'var(--blanco-estelar)',
            }}
            className="nodrag nopan"
          >
            Holgura: {data.slack.toFixed(2)}
          </div>
        )}
        
        {/* peso al centro */}
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: 'var(--azul-nebuloso)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: 14,
            fontWeight: 'bold',
            color: 'var(--amarillo-estrella)',
          }}
          className="nodrag nopan"
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default PathWithSlackEdge;