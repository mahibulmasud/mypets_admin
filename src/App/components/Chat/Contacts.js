import React, { useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap';
import { retrievedFromJwt } from '../../../utils/user-infos';
import ContactContainer from './ContactContainer';


const Contacts = ({ contacts, current, cloading, messageObject, lastRead, setCurrent, incoming, first = false, selected, setSelected, fselected, selectedChannel, setSelectedChannel }) => {


    const [changed, setChanged] = useState(Date.now());
    const [contactArray, setContactArray] = useState(contacts); useEffect(() => {
        let tmpcontacts = contacts.filter(() => true)
        setContactArray(tmpcontacts)
    }, [contacts])


    const fcontacts = [
        {
            username: "Team - MyPetsLife",

        },
        {
            username: "AdoptMyPets"
        }
    ]
    const [firstcontact, setFirstContact] = useState(fcontacts);

    const authTokens = localStorage.getItem("token");

    useEffect(() => {
        // console.log({ lastRead, incoming, messageObject });
        setChanged(Date.now())
    }, [lastRead, incoming, messageObject])


    return <>
        {
            cloading ? <Spinner /> : contacts.map((val, index) => {
                const { name } = val;

                let count = 0;
                let last_message, message_array = [], lastRead;
                let selected = (current != null) ? (current.name === val.name) : false;
                if (messageObject[name] !== undefined) {

                    message_array = messageObject[val.name];
                    last_message = (message_array !== undefined && message_array.length > 0) ? message_array[message_array.length - 1].body : ""
                    if (selected && current) {
                        count = 0;
                        if (val.channel.lastMessage) {
                            current.channel.updateLastConsumedMessageIndex(val.channel.lastMessage.index);
                            let attributes = val.channel.attributes;
                            attributes["my-pets"] = val.channel.lastMessage.index;
                            console.log({ attributes })
                            current.channel.updateAttributes(attributes);
                        }
                    }
                    else {

                        count = (message_array !== undefined && message_array.length > 0) ? message_array[message_array.length - 1].index - val.channel.lastConsumedMessageIndex : 0;
                        let author = (message_array !== undefined && message_array.length > 0) ? message_array[message_array.length - 1].author : { author: "" };
                        console.log({ author, email: retrievedFromJwt(authTokens).email })
                        if (author == retrievedFromJwt(authTokens).email) {
                            count = 0;
                        }
                    }
                    lastRead = message_array.length > 0 ? new Date(message_array[message_array.length - 1 - count].dateUpdated.toISOString()).getTime() : null
                }
                console.log({ val })
                return <ContactContainer key={`${val.channel.uniqueName}`} contacts={contactArray} selectedChannel={selectedChannel} setSelectedChannel={setSelectedChannel} lastReadTime={lastRead} current={current} count={count} index={index} setSelected={setSelected} setCurrent={setCurrent} selected={val.channel.uniqueName == selectedChannel} user={val} lastRead={lastRead} last_message={last_message} />

            })
        }
    </>
}

export default Contacts;