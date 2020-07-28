import * as React from 'react'
import { useEffect } from 'react'
import Sketch from './Sketch'
import GeneEditor from './GeneEditor'
import './app.css'

const App: React.FC = () => {
    useEffect(() => {
        window.addEventListener('keydown', e => {
            if (e.keyCode === 32 && e.target === document.body)
                e.preventDefault()
        })
    }, [])

    return (
        <div>
            <Sketch />
            <GeneEditor />
        </div>
    )
}

export default App
