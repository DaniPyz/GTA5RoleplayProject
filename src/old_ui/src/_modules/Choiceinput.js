import React from 'react'
import $ from 'jquery'

import './choiceinput.css'

export default function Choiceinput(data)
{
    const [ selParam, setSelParam ] = React.useState(0)
    const params = data.data.params

    React.useMemo(() =>
    {
        if(data.data.select) setSelParam(data.data.select)
    }, [data.data.select])

    function click(move)
    {
        if(selParam <= 0
            && move === 0)
        {
            setSelParam(params.length - 1)
            data.data.onChange(params.length - 1)
        }

        if(selParam >= params.length - 1
            && move === 1)
        {
            setSelParam(0)
            data.data.onChange(0)
        }

        if(selParam < params.length - 1
            && move === 1)
        {
            setSelParam(selParam + 1)
            data.data.onChange(selParam + 1)
        }
        if(selParam > 0
            && move === 0)
        {
            setSelParam(selParam - 1)
            data.data.onChange(selParam - 1)
        }
    }

    return (
        <div className={`input-choice ${selParam === -1 ? "" : "input-choice-sel"}`}>
            <button onClick={() => click(0)}>◄</button>
            <h1>{selParam === -1 ? "Ничего не выбрано" : params[selParam]}</h1>
            <button onClick={() => click(1)}>►</button>
        </div>
    )
}
