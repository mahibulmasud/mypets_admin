import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Dropdown, Row, Spinner } from 'react-bootstrap';
import EditComponent from '../components/EditComponent'
import TopicBanner from '../components/TopicBanner'
export default function Forum() {

    const categories = [{ name: "Global", value: "global" }, { name: "Chien", value: "dog" }, { name: "Chat", value: "cat" }, { name: "N.A.C", value: "nac" }, { name: "Autres", value: "other" },
    ];
    const subcategories = [{ name: "Global", value: "global" }, { name: "Santé", value: "first" }, { name: "Traitement", value: "second" }, { name: "Forme", value: "third" }, { name: "Saillie", value: "fourth" }
        , { name: "Grossesse", value: "fifth" }, { name: "Nouveauné", value: "sixth" }, { name: "Nutrition", value: "seventh" }, { name: "Avis/conseils", value: "eighth" }
    ];

    const [categorie, setCategorie] = useState(0);
    const [subcategorie, setSubCategorie] = useState(0);
    const [forums, setForums] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        fetchForums();
    }, [categorie, subcategorie])


    const fetchForums = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.REACT_APP_BURL}/forum/getTopics`, {
                params: {
                    category: categories[categorie].value, sub_category: subcategories[subcategorie].value
                }
            });
            setLoading(false);
            setForums(res.data.forums);
        }
        catch (e) {
            setLoading(false);

            console.log(e)
        }
    }


    return (
        <div>
            <Row noGutters>
                <Dropdown >
                    <Dropdown.Toggle variant={'div'} id="dropdown-basic">
                        {`Categorie - ${categories[categorie].name}`}
                    </Dropdown.Toggle>
                    <ul>
                        <Dropdown.Menu>
                            {
                                categories.map((val, i) => <li onClick={() => setCategorie(i)}>{val.name}</li>)
                            }
                        </Dropdown.Menu>
                    </ul>
                </Dropdown>
                <Dropdown className="ml-2">
                    <Dropdown.Toggle variant={'div'} id="dropdown-basic">
                        {`Sous catégorie - ${subcategories[subcategorie].name}`}
                    </Dropdown.Toggle>
                    <ul>
                        <Dropdown.Menu>
                            {
                                subcategories.map((val, i) => <li onClick={() => setSubCategorie(i)}>{val.name}</li>)
                            }
                        </Dropdown.Menu>
                    </ul>
                </Dropdown>
            </Row>
            {
                loading ? <div className="w-100 text-center h-100"><Spinner animation="border" size="lg" /></div> : forums.length > 0 ?
                    forums.map(val => <TopicBanner id={val._id} topic={val.title} description={val.description} response={9} date={val.publication_date} user={val.user_id} />)
                    : <div className="w-100 h-100 row no-gutters justify-content-center align-items-center">
                        <h5>No Blogs Yet</h5>
                    </div>
            }
            {/* <EditComponent /> */}
        </div>
    )
}
