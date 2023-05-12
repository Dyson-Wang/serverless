import { useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { getNamespaceFunction } from '../../utils/axios'
import FCTable from './fctable'

const ChildNamespacePage = () => {
    const params = useParams()
    useEffect(() => {
        getNamespaceFunction(params.id).then(data => console.log(data));
    }, [])
    const data = useSelector(state => state.functionState.map((ele, i) => {
        if (ele.namespace == params.id) return ele;
    }));

    return <>
        <FCTable data={data} />
    </>
}

export default ChildNamespacePage;