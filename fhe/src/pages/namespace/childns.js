import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import FCTable from './fctable'
import DbCom from './dbconfig'

const ChildNamespacePage = () => {
    const params = useParams()
    const data = useSelector(state => state.functionState.map((ele, i) => {
        if (ele.namespace == params.id) return ele;
    }));

    return <>
        <FCTable data={data} db={true} />
    </>
}

export default ChildNamespacePage;