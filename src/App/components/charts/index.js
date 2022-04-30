
import React, { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    LabelList,
    Label,
    ResponsiveContainer
} from "recharts";

const montharray = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];


const data = [
    {
        "name": "1",
        "uv": 1000,
    },
    {
        "name": "2",
        "uv": 3000,
    },
    {
        "name": "3",
        "uv": 3000,
    },
    {
        "name": "4",
        "uv": 1000,
        "pv": 2400,
        "amt": 2400
    },
    {
        "name": "5",
        "uv": 0,
        "pv": 1398,
        "amt": 2210
    },
    {
        "name": "6",
        "uv": 3000,
        "pv": 1398,
        "amt": 2210
    },
    // {
    //   "name": "Page d",
    //   "uv": 2000,
    //   "pv": 9800,
    //   "amt": 2290
    // },
    // {
    //   "name": "Page e",
    //   "uv": 2780
    // }
]
const calculateWeek = (val) => {
    let days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let month = val.getMonth();
    let date = val.getDate();
    let previousDays = 0;
    for (let x in days) {
        if (x < month) {
            previousDays += days[x];
        }
        else break;
    }
    let totalDay = previousDays + date;
    return (totalDay % 7 == 0) ? totalDay / 7 : parseInt(totalDay / 7) + 1;
}


const currentYear = new Date().getFullYear();
const currentWeek = calculateWeek(new Date());
const currentMonth = new Date().getMonth();


export default function Chart(props) {

    const [dataArray, setDataArray] = useState([]);
    const { x, y, fetched, data } = props;

    useEffect(() => {
        if (Object.keys(props.data).length > 0) {
            let tarray = props.data[`${currentYear}`];
            let presentArray = [];
            let finalArray = [];
            let previousArray = [];
            let sortedPreviousArray = [];
            let sortedPresentArray = [];
            if (props.type == "month") {
                for (let x in [0, 1, 2, 3, 4, 5]) {
                    let t = currentMonth - x >= 0 ? currentMonth - x : 12 - (x - currentMonth);
                    let array = currentMonth - x >= 0 ? tarray : props.data[`${currentYear - 1}`];
                    if (currentMonth - x >= 0) {

                        presentArray.push({
                            name: montharray[t],
                            uv: array ? array[`${t}`] ? array[`${t}`] : 0 : 0
                        })
                    }
                    else {
                        previousArray.push({
                            name: montharray[t],
                            uv: array ? array[`${t}`] ? array[`${t}`] : 0 : 0
                        })
                    }

                }
                sortedPreviousArray = previousArray.sort((a, b) => {
                    let findex = montharray.findIndex((val => a.name == val));
                    let sindex = montharray.findIndex(val => b.name == val);
                    return findex - sindex
                });
                sortedPresentArray = presentArray.sort((a, b) => {
                    let findex = montharray.findIndex((val => a.name == val));
                    let sindex = montharray.findIndex(val => b.name == val);
                    return findex - sindex
                });
            }
            else {
                for (let x in [0, 1, 2, 3, 4, 5]) {
                    let t = currentWeek - x > 0 ? currentWeek - x : 53 - (x - currentWeek);
                    console.log({ t, currentWeek })
                    let array = currentWeek - x > 0 ? tarray : props.data[`${currentYear - 1}`];
                    if (currentWeek - x > 0) {
                        presentArray.push({
                            name: t,
                            uv: array ? array[`${t}`] ? array[`${t}`] : 0 : 0
                        })
                    }
                    else {
                        previousArray.push({
                            name: t,
                            uv: array ? array[`${t}`] ? array[`${t}`] : 0 : 0
                        })
                    }

                }
                sortedPreviousArray = previousArray.sort((a, b) => a.name - b.name);
                sortedPresentArray = presentArray.sort((a, b) => a.name - b.name);
            }
            finalArray = [...sortedPreviousArray, ...sortedPresentArray];
            setDataArray(finalArray);
            console.log({ previousArray, presentArray })
        }
    }, [props.data])

    return (
        <ResponsiveContainer
            width="100%"
            height={250}>
            <BarChart
                data={dataArray}
                margin={{ top: 5, right: 30, left: 30, bottom: 15 }}
            >
                <XAxis dataKey="name">
                    <Label value={x} position="insideBottom" offset={-9} />
                </XAxis>
                <YAxis allowDecimals={false} label={{ value: y, angle: -90, position: 'insideLeft', textAnchor: 'middle' }} />

                <Bar dataKey="uv" fill="#13E2BA">
                    <LabelList dataKey="uv" fill="#ffffff" fontSize={10} position="center" />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
