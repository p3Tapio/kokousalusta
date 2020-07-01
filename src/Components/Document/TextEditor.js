import React from 'react'
import { Editor } from "@tinymce/tinymce-react"

export const TextEditor = ({ editorContentChange, kokouskutsu }) => {


    return (
        <div style={{ contenteditable: 'true', zIndex: '100 !important' }}>

            <Editor apiKey={process.env.REACT_APP_TINYAPI_KEY}
                onEditorChange={editorContentChange}
                value={kokouskutsu}
                init={{
                    height: 750,
                    plugins: [
                        'advlist lists link image print',
                        'charmap print preview anchor help',
                        'searchreplace visualblocks',
                        'insertdatetime table paste preview'
                    ],
                    toolbar: [
                        'preview print | undo redo | formatselect | bold italic |  alignleft aligncenter alignright |  bullist numlist outdent indent | help | insertdatetime'],
                    insertdatetime_dateformat: ["%HH:%M", "%d-%m-%Y"],

                    setup: function (ed) {
                        ed.on('keydown', function (evt) {
                            if (evt.keyCode === 9) {
                                ed.execCommand('mceInsertRawHTML', false, '&emsp;&emsp;');
                                evt.preventDefault();
                                evt.stopPropagation();
                                return false;
                            }
                        })

                    }
                }}
            />

        </div>
    )
}
