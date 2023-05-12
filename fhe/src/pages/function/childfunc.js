import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {getNamespaceFunction} from '../../utils/axios'

const ChildFuncPage = () => {
    const params = useParams()

    return <>
        <p>{params.id}</p>
    </>
}

export default ChildFuncPage;