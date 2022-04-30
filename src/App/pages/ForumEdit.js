import React, { useEffect, useState } from 'react'
import EditComment from '../components/EditComment'
import TopicDescriptionBanner from "../components/TopicDescriptionBanner";
import { useHistory, useParams } from "react-router-dom"
import { retrievedFromJwt } from '../../utils/user-infos';
import jwt from "jsonwebtoken"
import { Container, Modal, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { EditorState, ContentState } from "draft-js"
import htmlToDraft from 'html-to-draftjs';

export default function ForumEdit() {

    const params = useParams()
    const [forumDescription, setForumDescription] = useState(null)
    const [comments, setComments] = useState([]);
    const authTokens = localStorage.getItem("token");
    let user = retrievedFromJwt(authTokens);
    const [blogLoading, setBlogLoading] = useState(false);
    const [editorState, setEditorState] = useState(null);
    const [modal, setModal] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState(null);
    const [currentComment, setCurrentComment] = useState(null);
    const history = useHistory();

    useEffect(() => {
        if (params.id !== null && params.id !== undefined && params !== "") {
            let id_array = params.id.split(":");
            fetchForumDescription(id_array[1])
            fetchComments(id_array[1]);
        }
    }, [])


    const fetchForumDescription = async (id) => {
        try {
            console.log("fetching comment")
            setBlogLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_BURL}/forum/getTopicById`, {
                params: {
                    id: id
                }
            });
            setBlogLoading(false);
            const decoded = jwt.verify(res.data.forumDescription, "Mundaka");
            setForumDescription(decoded.forumDescription);
        }
        catch (e) {
            setBlogLoading(false)
            console.log(e);
        }

    }


    const fetchComments = async (id) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BURL}/forum/getComments`,
                {
                    params: {
                        id: id
                    }
                });
            const decoded = jwt.verify(res.data.comments, "Mundaka");
            console.log({ decoded });
            setComments(decoded.comments);
        }
        catch (e) {
            console.log(e);
        }
    }

    const createComment = async (val = "new") => {
        try {
            setLoading(true);
            let id_array = params.id.split(":");
            let user_id;
            if (retrievedFromJwt(authTokens) !== null && retrievedFromJwt(authTokens) !== undefined) {
                user_id = retrievedFromJwt(authTokens)._id;
                let comment;
                let token;
                if (val === "edit") {
                    comment = { topic_id: id_array[1], user_id, content, id: comments[currentComment]._id };
                    token = jwt.sign(
                        { comment },
                        "Mundaka"
                    );
                    await axios.put(`${process.env.REACT_APP_BURL}/forum/editComment`, { token });
                }
                else {
                    comment = { topic_id: id_array[1], user_id, content };
                    token = jwt.sign(
                        { comment },
                        "Mundaka"
                    );
                    await axios.post(`${process.env.REACT_APP_BURL}/forum/postComment`, { token });
                }
                window.alert("Saved");
                setLoading(false);
                fetchComments(id_array[1])
            }
            else {
                alert("Kindly login to post comments");
                throw "failed"
            }
        }
        catch (e) {
            console.log(e);
            window.alert("failed")
            setLoading(false)
        }
    }

    const editTopic = async (val = "new") => {
        setLoading(true);
        let object = { id: forumDescription._id, _id: user._id, title: forumDescription.title, content, description: forumDescription.description };
        try {
            const res = await axios.put(`${process.env.REACT_APP_BURL}/forum/editTopic`, object);
            console.log(res.data);
            setLoading(false);
            let id_array = params.id.split(":");
            fetchForumDescription(id_array[1]);
            setModal(false);
        }
        catch (e) {
            setLoading(false);
            console.log(e);
        }
    }

    const editComment = async (val) => {
        createComment("edit");
    }

    const deleteTopic = async () => {
        try {
            setDeleteLoading(true);
            await axios.post(`${process.env.REACT_APP_BURL}/forum/deleteTopic`, {
                id: forumDescription._id,
                _id: user._id
            })
            setDeleteLoading(false);

            setDeleteModal(false);
            history.push("/forum");
        }
        catch (e) {
            setDeleteLoading(false);
        }
    }

    const deleteComment = async () => {
        try {
            setDeleteLoading(true);
            await axios.post(`${process.env.REACT_APP_BURL}/forum/deleteComment`, {
                id: comments[currentComment]._id,
                _id: user._id
            })
            setDeleteLoading(false);
            setDeleteModal(false);
            fetchComments();
        }
        catch (e) {
            setDeleteLoading(false);
        }
    }

    const topicToolArray = [{
        name: "Modify", func: () => {
            setCurrent("topic");
            const blocksFromHtml = htmlToDraft(forumDescription.content);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
            setModal(true);
        }
    }, {

        name: "Delete", func: () => {
            setCurrent("topic");
            setDeleteModal(true);
        }
    }]

    const commentToolArray = [{
        name: "Modify", func: (val) => {
            setCurrent("comment");
            setCurrentComment(val);
            const blocksFromHtml = htmlToDraft(comments[val].content);
            const { contentBlocks, entityMap } = blocksFromHtml;
            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
            setModal(true);
        }
    }, {

        name: "Delete", func: (val) => {
            setCurrentComment(val);
            setCurrent("comment");
            setDeleteModal(true);
        }
    }]



    return (
        <>
            <Container>
                {
                    blogLoading ? <div className="w-100 text-center h-100"><Spinner animation="border" size="lg" /></div> : <>
                        <div>
                            {
                                forumDescription !== null && <TopicDescriptionBanner array={topicToolArray} correct topic={forumDescription.title} description={forumDescription.content} date={forumDescription.publication_date} user={forumDescription.user_id} />
                            }
                        </div>

                        <div>
                            {
                                comments.map((val, i) => <TopicDescriptionBanner index={i} array={commentToolArray} description={val.content} user={val.user_id} />)
                            }
                        </div>
                        <EditComment createComment={createComment} loading={loading} setContent={setContent} content={content} />
                    </>
                }
            </Container>
            <Modal size="lg" show={modal} onHide={() => setModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Forum</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <EditComment createComment={current === "topic" ? editTopic : editComment} loading={loading} editor={editorState} setContent={setContent} content={content} />
                </Modal.Body>
            </Modal>
            <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Deleting {current === "topic" ? "Topic" : "Comment"}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Are you sure you want to delete this {current}?</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" disabled={deleteLoading} onClick={() => setDeleteModal(false)}>Close</Button>
                    <Button variant="danger" disabled={deleteLoading} onClick={current === "topic" ? deleteTopic : deleteComment} >{deleteLoading ? <><Spinner animation="border" size="sm" /><span className="ml-1">Deleting</span></> : "Delete"}</Button>
                </Modal.Footer>
            </Modal>

        </>
    );
}
