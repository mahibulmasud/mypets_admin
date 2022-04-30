import React, { useState, useEffect } from 'react'
import EditComponent from '../components/EditComponent'
import jwt from "jsonwebtoken";
import axios from 'axios';
import { retrievedFromJwt } from '../../utils/user-infos';
import { useHistory } from 'react-router-dom';
export default function BlogEdit() {



    const [picture, setPicture] = useState("");
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [title, setTitle] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [user, setUser] = useState(null);
    const token = localStorage.getItem("token");
    const history = useHistory()

    useEffect(() => {
        if (token !== undefined && token !== null && retrievedFromJwt(token) !== null) {
            setUser(retrievedFromJwt(token));
        }
    }, [])

    const saveBlog = async () => {
        try {
            if (user !== null) {
                console.log({
                    picture, content, title, shortDescription, secret: process.env.REACT_APP_TOKEN_SECRET
                });
                setLoading(true);
                let blog = { title, description: shortDescription, image: picture, author: user._id, content };
                console.log({ blog })
                let formData = new FormData();
                formData.append("file", picture);
                formData.append("title", title);
                formData.append("description", shortDescription);
                formData.append("author", author);
                formData.append("content", content);
                const res = await axios.post(`${process.env.REACT_APP_BURL}/blog/add`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                });
                console.log(res.status);
                setLoading(false);
                alert("saved");
                history.push("/blog");
            }

        }
        catch (e) {
            alert("Failed Try again !");
            setLoading(false);
            console.log({ e });
        }
    }


    return (
        <div>
            <EditComponent
                setPicture={setPicture}
                content={content}
                setContent={setContent}
                setLoading={setLoading}
                loading={loading}
                author={author}
                setAuthor={setAuthor}
                title={title}
                setShortDescription={setShortDescription}
                setTitle={setTitle}
                saveBlog={saveBlog}
            />
        </div>
    )
}
