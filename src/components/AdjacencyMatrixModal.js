import React from 'react';

const AdjacencyMatrixModal = ({ nodes, matrix, onClose }) => {
    if (!matrix) {
        return null;
    }
    const getNodeLabel = (node) => node.data.label.substring(0, 6);
    return (
        <div className="modal-overlay">
            <div className="matrix-modal-content">
                <h2>Matriz de Adyacencia</h2>
                <div className="matrix-container">
                    <table>
                        <thead>
                            <tr>
                                <th>🪐</th>
                                {nodes.map(node => (
                                    <th key={node.id} title={node.data.label}>
                                        {getNodeLabel(node)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {matrix.map((row, rowIndex) => (
                                <tr key={nodes[rowIndex].id}>
                                    <th title={nodes[rowIndex].data.label}>
                                        {getNodeLabel(nodes[rowIndex])}
                                    </th>
                                    {row.map((value, colIndex) => (
                                        <td key={`${nodes[rowIndex].id}-${nodes[colIndex].id}`}>
                                            {value}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="modal-buttons">
                    <button className="modal-button save-button" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    );
};

export default AdjacencyMatrixModal;