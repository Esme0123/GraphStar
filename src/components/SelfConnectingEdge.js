import React from 'react';
import { getSmoothStepPath, EdgeText } from 'reactflow';

export default function SelfConnectingEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  label,
  markerEnd,
}) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX: targetX + 40, 
    targetY: targetY - 40, 
    targetPosition,
    borderRadius: 25, 
  });

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: 'var(--verde-estelar)', strokeWidth: 3 }}
      />
      {label && (
        <EdgeText
          x={labelX + 20} 
          y={labelY - 20} 
          label={label}
          labelStyle={{ fill: 'var(--amarillo-estrella)' }}
          labelBgStyle={{ fill: 'var(--azul-nebuloso)' }}
        />
      )}
    </>
  );
}