import React from 'react';

const SortVisualizer = ({ array, animationState }) => {
    return (
        <div className="sort-visualizer-container">
            {array.map((value, idx) => {
                const { comparing, swapping, sorted, key } = animationState;

                // Determina la clase CSS para la animación
                const isComparing = comparing?.includes(idx);
                const isSwapping = swapping?.includes(idx);
                const isKey = key === idx;
                const isSorted = sorted?.includes(idx);

                const bubbleClass = `sort-bubble 
                    ${isComparing ? 'comparing' : ''} 
                    ${isSwapping ? 'swapping' : ''}
                    ${isKey ? 'key-element' : ''}
                    ${isSorted ? 'sorted' : ''}`;

                return (
                    <div
                        className={bubbleClass}
                        key={idx}
                        style={{
                            // Hacemos el tamaño de la burbuja proporcional a su valor
                            width: `${value * 2 + 30}px`,
                            height: `${value * 2 + 30}px`,
                        }}
                    >
                        <span className="bubble-value">{value}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default SortVisualizer;