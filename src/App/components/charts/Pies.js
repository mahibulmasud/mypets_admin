
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";



const COLORS = ["#08cba5", "#ed1944"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    data
}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);


    if (percent > 0) {
        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    }
    else {
        return ""
    }
};
export default function Pies(props) {
    const [data, setData] = useState([])

    useEffect(() => {
        let array = [{
            name: "MALE",
            value: props.data.male
        }, {
            name: "FEMALE",
            value: props.data.female
        }];
        setData(array);
    }, [props.data])
    return (
        <PieChart width={200} height={200}>
            <Pie
                data={data}
                cx={90}
                cy={90}
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
        </PieChart>
    );
}
