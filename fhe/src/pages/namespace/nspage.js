import { useState } from 'react';
import NamespaceTable from './namespacetable';
import NewNamespace from './newns';

const NamespacePage = () => {
    const [open, setOpen] = useState(false);
    const setof = (v) => setOpen(v);
    return open == false ? <NamespaceTable setOpen={setof} /> : <NewNamespace setOpen={setof} />
}

export default NamespacePage;