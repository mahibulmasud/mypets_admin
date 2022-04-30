import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Table, Modal, Button, Spinner } from 'react-bootstrap'
import { decryptData } from '../../utils/user-infos'
import jwt from "jsonwebtoken";
import { retrievedFromJwt } from '../../utils/user-infos';
import "./blog.css"
import EditComponent from '../components/EditComponent';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState, convertToRaw } from "draft-js"
export default function Blog() {

    const [blogs, setBlogs] = useState([]);


    const [picture, setPicture] = useState("");
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [user, setUser] = useState(null);
    const [modal, setModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [blogLoading, setBlogLoading] = useState(false);
    const [editorState, setEditorState] = useState(null);
    const [author, setAuthor] = useState("")
    const token = localStorage.getItem("token");



    useEffect(() => {
        if (token !== undefined && token !== null && retrievedFromJwt(token) !== null) {
            setUser(retrievedFromJwt(token));
        }
    }, [])

    const editBlog = async () => {
        try {
            if (user !== null) {
                let edited = false;
                if ((typeof picture) == "object") {
                    edited = true;
                }
                // console.log({
                //     picture, content, title, shortDescription, secret: process.env.REACT_APP_TOKEN_SECRET
                // });
                setLoading(true);
                // let blog = { title, description: shortDescription, image: picture, author: user._id, content, id: blogs[selectedId]._id };
                // let token = jwt.sign(
                //     { blog },
                //     process.env.REACT_APP_TOKEN_SECRET
                // );;
                let formData = new FormData();
                formData.append("file", picture);
                formData.append("title", title);
                formData.append("description", shortDescription);
                formData.append("author", author);
                formData.append("content", content);
                formData.append("id", blogs[selectedId]._id)
                formData.append("edited", edited ? "true" : "false");
                const res = await axios.put(`${process.env.REACT_APP_BURL}/blog/edit`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                });
                setLoading(false);
                alert("Edited");
                setModal(false);
                getBlogs();
            }

        }
        catch (e) {
            setLoading(false);
            console.log(e);
        }
    }

    const setEditBlog = async (val) => {
        const { title, description, content, photo, author } = blogs[val];
        setTitle(title);
        console.log(blogs[val])
        setSelectedId(val);
        setShortDescription(description);
        setPicture(photo);
        setAuthor(author)
        const blocksFromHtml = htmlToDraft(content);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
        setModal(true);
    }

    useEffect(() => {
        getBlogs();
    }, [])

    const getBlogs = async () => {
        try {
            setBlogLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_BURL}/blog`);
            const data = decryptData(res.data.blogToken);
            setBlogs(data.blog);
            setBlogLoading(false);
        }
        catch (e) {
            setBlogLoading(false);
            console.log(e);
        }
    }

    const deleteBlog = async () => {
        try {
            console.log(blogs[selectedId]._id)
            setDeleteLoading(true);
            const res = await axios.post(`${process.env.REACT_APP_BURL}/blog/delete`, { id: blogs[selectedId]._id });
            setDeleteLoading(false);
            console.log(res);
            alert("delete successful");
            setDeleteModal(false);

            getBlogs();
        }
        catch (e) {
            console.log(e);
            alert("Try again");
            setDeleteLoading(false);
        }
    }

    return (
        <div>
            {
                blogLoading ? <div className="w-100 text-center h-100"><Spinner animation="border" size="lg" /></div> : blogs.length > 0 ? <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Titre</th>
                            <th>Description</th>
                            <th>Modifier</th>
                            <th>Supprimer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            blogs.map((val, i) => <tr>
                                <td>{i + 1}</td>
                                <td>{val.title}</td>
                                <td>{val.description}</td>
                                {/* <td><i className="fa fa-eye" aria-hidden="true"></i></td> */}
                                <td><i onClick={() => {
                                    setEditBlog(i);
                                }} className="fas fa-edit"></i></td>
                                <td><i onClick={() => {
                                    setDeleteModal(true)
                                    setSelectedId(i)
                                }} className="fa fa-trash" aria-hidden="true"></i></td>
                            </tr>)
                        }
                    </tbody>
                </Table> : <div className="w-100 h-100 row no-gutters justify-content-center align-items-center">
                    <h5>No Blogs Yet</h5>
                </div>
            }
            <Modal size="lg" show={modal} onHide={() => setModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Modifier l’article</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <EditComponent
                        edit={true}
                        setPicture={setPicture}
                        picture={picture}
                        content={content}
                        setContent={setContent}
                        setLoading={setLoading}
                        loading={loading}
                        title={title}
                        setShortDescription={setShortDescription}
                        setTitle={setTitle}
                        saveBlog={editBlog}
                        author={author}
                        setAuthor={setAuthor}
                        editor={editorState}
                    />
                </Modal.Body>
            </Modal>
            <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Deleting blog</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Are you sure you want to delete this blog?</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" disabled={deleteLoading} onClick={() => setDeleteModal(false)}>Close</Button>
                    <Button variant="danger" disabled={deleteLoading} onClick={deleteBlog} >{deleteLoading ? <><Spinner animation="border" size="sm" /><span className="ml-1">Deleting</span></> : "Delete"}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
