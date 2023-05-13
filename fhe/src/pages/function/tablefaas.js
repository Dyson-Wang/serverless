import { useSelector } from 'react-redux';
import FCTable from '../namespace/fctable';

const TableFaas = () => {
    const data = useSelector(state => state.functionState);
    return <>
        <FCTable data={data} db={false} />
    </>
}

export default TableFaas;