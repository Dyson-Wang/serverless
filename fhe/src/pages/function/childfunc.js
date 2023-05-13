import { useEffect, useState } from 'react'
import { useSelector, } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getUserFunctionConfig } from '../../utils/axios'
import FCForm from './fcform'

const ChildFuncPage = () => {
    const [state, setState] = useState(undefined);
    const params = useParams();
    const namespace = useSelector(state => {
        if (state.functionState != undefined && state.functionState.length != 0) {
            return state.functionState.map((e, i) => {
                if (e.faasname === params.id) return e.namespace
            })
        } else {
            return []
        }
    })
    useEffect(() => {
        if (namespace.length == 0) {
            return
        }
        getUserFunctionConfig(params.id, namespace[0]).then(v => setState(v[0]))
    }, [])

    return <>
        {state == undefined ? <></> : <FCForm props={state} />}
    </>
}

export default ChildFuncPage;