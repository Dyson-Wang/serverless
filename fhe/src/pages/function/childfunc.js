import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { delUserFunction, getUserFunctionConfig, getUserFunction, getMain } from '../../utils/axios'
import FCForm from './fcform'
import { Button } from 'antd'

const ChildFuncPage = () => {
    const [state, setState] = useState(undefined);
    const navigate = useNavigate()
    const params = useParams();
    const dispatch = useDispatch()
    const browsertoken = useSelector(state => state.browsertoken)
    const namespace = useSelector(state => {
        if (state.functionState != undefined && state.functionState.length != 0) {
            return state.functionState.map((e, i) => {
                if (e.faasname === params.id) return e.namespace
            }).filter((ele, i)=>{
                if(ele != undefined)return true 
            })
        } else {
            return []
        }
    })
    useEffect(() => {
        if (namespace.length == 0) {
            return
        }
        getUserFunctionConfig(params.id, namespace[0], browsertoken).then(v => setState(v[0]))
    }, [])

    return <>
        {state == undefined ? <></> : <FCForm props={state} del={true} delCallback={() => {
            delUserFunction(state.faasname, state.namespace, browsertoken).then(v => {
                getMain().then(value => dispatch({ type: 'setMainInfo', value: value.message[0] }))
                getUserFunction(browsertoken).then(data => {
                    dispatch({ type: 'setNewFunctionStatus', value: data })
                    // history.back()
                    navigate(-1)
                })
            })
        }} />}
    </>
}

export default ChildFuncPage;