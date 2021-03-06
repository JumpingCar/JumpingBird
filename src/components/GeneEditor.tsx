import * as React from 'react'

const GeneEditor: React.FC = () => {
    return (
        <div id="gene-editor">
            <h2 className='header'>Gene Editor</h2>
            <textarea id="gene-editor-textarea"></textarea>
            <div className="buttons">
                <button id="gene-import">Import</button>
                <button id="gene-export">Export</button>
            </div>
        </div>
    )
}

export default GeneEditor