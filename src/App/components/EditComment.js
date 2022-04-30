import React, { Component, useEffect, useState } from 'react';
import { ContentState, convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./EditComponent.css"
import { Spinner, Row, Button } from 'react-bootstrap';

export default ({ setContent, loading = false, createComment, editor = null }) => {

    const [editorState, setEditorState] = useState(editor !== null ? editor : EditorState.createEmpty());
    return (
        <>
            <div className="wrapper-class shadow-sm" style={{ borderRadius: 10 }}>
                <h3 className="text-white text-left">Commentaire de l’administrateur</h3>
                <Editor
                    onEditorStateChange={(newState) => {
                        setEditorState(newState);
                        setContent(draftToHtml(convertToRaw(newState.getCurrentContent())))
                    }}
                    editorState={editorState}
                    editorClassName="editor-comment"
                    toolbarClassName="toolbar-class"
                />
                <Row noGutters className="justify-content-end">
                    <Button onClick={loading ? () => { } : createComment} style={{ backgroundColor: "#EC1D45" }} className="mt-2" variant="danger">
                        {loading ? <><Spinner size="sm" animation="border" />Creating</> : "Publier"}
                    </Button>
                </Row>

            </div>
        </>
    )
}