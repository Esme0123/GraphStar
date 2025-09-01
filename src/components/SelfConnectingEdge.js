import React from 'react';
import { BaseEdge, EdgeLabelRenderer, Position } from 'reactflow';

const BASE_LOOP_SIZE = 50; 
const LOOP_INCREMENT = 20; 

export default function SelfConnectingEdge({
  id,
  sourceX,
  sourceY,
  label,
  style,
  markerEnd,
  sourcePosition,
  data,
}) {
  const loopIndex = data?.loopIndex || 0;
  const loopSize = BASE_LOOP_SIZE + loopIndex * LOOP_INCREMENT;

  let edgePath = '';
  let labelX = sourceX;
  let labelY = sourceY;

  switch (sourcePosition) {
    case Position.Top:
      edgePath = `M ${sourceX} ${sourceY} C ${sourceX - loopSize} ${sourceY - loopSize}, ${sourceX + loopSize} ${sourceY - loopSize}, ${sourceX} ${sourceY}`;
      labelY = sourceY - loopSize * 0.9;
      break;
    case Position.Bottom:
      edgePath = `M ${sourceX} ${sourceY} C ${sourceX - loopSize} ${sourceY + loopSize}, ${sourceX + loopSize} ${sourceY + loopSize}, ${sourceX} ${sourceY}`;
      labelY = sourceY + loopSize * 0.9;
      break;
    case Position.Left:
      edgePath = `M ${sourceX} ${sourceY} C ${sourceX - loopSize} ${sourceY - loopSize}, ${sourceX - loopSize} ${sourceY + loopSize}, ${sourceX} ${sourceY}`;
      labelX = sourceX - loopSize * 0.9;
      break;
    case Position.Right:
      edgePath = `M ${sourceX} ${sourceY} C ${sourceX + loopSize} ${sourceY - loopSize}, ${sourceX + loopSize} ${sourceY + loopSize}, ${sourceX} ${sourceY}`;
      labelX = sourceX + loopSize * 0.9;
      break;
    default:
      edgePath = `M ${sourceX} ${sourceY} C ${sourceX - loopSize} ${sourceY - loopSize}, ${sourceX + loopSize} ${sourceY - loopSize}, ${sourceX} ${sourceY}`;
      labelY = sourceY - loopSize * 0.9;
      break;
  }

  return (
    <>
      <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: 'var(--azul-nebuloso)',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: 16,
            fontWeight: 'bold',
            color: 'var(--amarillo-estrella)',
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}