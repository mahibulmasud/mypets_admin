import React from 'react'
import "./toolbox.css"
export default function Toolbox({ array, index }) {
    return (
        <div className="toolbox-container">
            <div className="toolbox p-1">
                {
                    array.map(val => <div onClick={index !== null ? () => { val.func(index) } : val.func} className="pb-1 w-100 pl-3 pr-3">{val.name}</div>)
                }
                <div className="toolbox-triangle" />
            </div>
        </div>
    )
}
