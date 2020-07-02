import React from 'react'
import { Editor } from "@tinymce/tinymce-react"

const DocumentView = ({ setShowTable, document }) => {
    console.log('document', document)

    const print = () => window.tinymce.activeEditor.execCommand("mcePrint", true)

    return (
        <div>
            <div className="text-right">
                {document.draft === "0" ? <></> : <button className="btn btn-outline-primary btn-sm">Muokkaa</button>}
                <button className="btn btn-outline-primary btn-sm" onClick={print}>Tulosta</button>
                <button className="btn btn-outline-primary btn-sm" onClick={() => setShowTable(true)}>Sulje</button>
            </div>
            <div style={{ zIndex: '100 !important' }}>
                <Editor apiKey={process.env.REACT_APP_TINYAPI_KEY}
                    disabled={true}
                    value={document.content}
                    init={{
                        menubar: false,
                        toolbar: false,
                        selector: "textarea",
                        plugins: ["autoresize print"]
                    }}
                />
            </div>
        </div>
    )
}
export default DocumentView
