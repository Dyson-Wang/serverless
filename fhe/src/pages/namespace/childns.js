import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import FCTable from './fctable'
import DbCom from './dbconfig'

const ChildNamespacePage = () => {
    const params = useParams()
    // 浅拷贝
    const data = useSelector(state => state.functionState.filter((ele, i) => {
        if (ele.namespace == params.id) return true
    }));

    return <>
        <FCTable data={data} db={true} />
    </>
}

export default ChildNamespacePage;