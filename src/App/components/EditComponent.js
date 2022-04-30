import React, { Component, useEffect, useState } from 'react';
import { ContentState, convertFromRaw, convertToRaw, EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "./EditComponent.css"
import { Button, Row, Spinner } from 'react-bootstrap';

export default ({ setTitle, setContent, title, tag, setPicture, picture = "", loading, setShortDescription, saveBlog, editor = null, author, setAuthor }) => {

    const [editorState, setEditorState] = useState(editorState !== null ? editor : EditorState.createEmpty());
    const [file, setFile] = useState(null);
    const [pic, setPic] = useState(picture);
    const [type, setType] = useState("image");
    // const toBase64 = (file) => {


    //     return new Promise((resolve, reject) => {
    //         const reader = new FileReader();
    //         reader.readAsDataURL(file);
    //         reader.onload = () => {
    //             resolve(reader.result);
    //         }
    //     })
    // }


    useEffect(() => {
        changePicName();
    }, [file])

    useEffect(() => {
        if (file == null) {
            let picArray = picture.split(".");
            if (picArray.length > 0) {
                if (picArray[picArray.length - 1] == "mp4") {
                    setType("video");
                }
                else if (picArray[picArray.length - 1] == "mp3" || picArray[picArray.length - 1] == "m4a") {
                    setType("audio");
                }
                else {
                    setType("image")
                }
            }
            else {
                setType("image")
            }
        }
        else {
            if (file.type == "video/mp4") {
                setType("video");
            }
            else if (file.type == "audio/mpeg") {
                setType("audio");
            }
            else {
                setType("image")
            }
        }
    }, [picture, pic])


    const changePicName = async () => {
        if (file !== null) {
            console.log("changing file")
            setPic(URL.createObjectURL(file))
            setPicture(file);
        }
        else if (!picture) {
            setPic(null)
        }
    }
    return (
        <>
            {
                tag && <div className="forum-tag">
                    {tag}
                </div>
            }
            <div className="wrapper-class shadow-sm">
                <input
                    value={title}
                    placeholder="Titre"
                    onChange={(e) => {
                        if (e.target.value.length <= 80) {
                            setTitle(e.target.value);
                        }
                    }}
                    className="forum-editor-heading" />
                <input
                    value={author}
                    placeholder="Auteur"
                    onChange={(e) => {
                        setAuthor(e.target.value);
                    }}
                    className="forum-editor-heading" />
                <Row noGutters className="justify-content-center">
                    <label for="blog-pic">
                        <div className="mpl-profile-picture-overlay"
                        >
                            {pic ? (type == "video") ? <div className="uploaded-image-wrapper w-100 h-100">
                                <div className="uploader">
                                    <div className="w-100 text-center">
                                        <i className="fas fa-edit fa-4x color-gradiant-black" />
                                    </div>
                                </div>
                                <video muted autoPlay className="w-100 h-100 uploading-image" src={pic} />
                            </div> : (type == "audio") ? <div className="uploaded-image-wrapper row no-gutters flex-column justify-content-center align-items-center w-100 h-100">
                                {/* <div className="uploader">
                                    <div className="w-100 text-center">
                                        <i className="fas fa-edit fa-4x color-gradiant-black" />
                                    </div>
                                </div> */}
                                <label for="blog-pic"> <i className="fas fa-edit fa-4x color-gradiant-black" /></label>
                                <audio controls className="w-100 " src={pic} />

                            </div> : <div className="uploaded-image-wrapper w-100 h-100">
                                <div className="uploader">
                                    <div className="w-100 text-center">
                                        <i className="fas fa-edit fa-4x color-gradiant-black" />
                                    </div>
                                </div>
                                <img className="w-100 h-100 uploading-image" src={pic} />
                            </div> : <div className="w-100 text-center">
                                <i className="fas fa-edit fa-4x color-gradiant-black" />
                            </div>}
                        </div>
                    </label>
                    <input type="file" id="blog-pic" accept="video/*,image/*,audio/*" onChange={(e) => { setFile(e.target.files[0]) }} name="blog-pic" style={{ display: "none" }} />
                </Row>
                <Editor
                    onEditorStateChange={(newState) => {
                        let text = newState.getCurrentContent().getPlainText()
                        let f_text = text.length < 1000 ? text : text.substr(0, 1000);
                        setShortDescription(f_text);
                        setEditorState(newState);
                        setContent(draftToHtml(convertToRaw(newState.getCurrentContent())))
                    }}
                    editorState={editorState}
                    editorClassName="editor-class"
                    toolbarClassName="toolbar-class"
                />
                <Row className="justify-content-center mt-2">
                    <Button onClick={saveBlog} disabled={loading} >{loading ? <><Spinner animation="border" size="sm" /><span className="ml-1">Saving</span></> : "Sauvegarder"}</Button>
                </Row>
            </div>
        </>
    )
}