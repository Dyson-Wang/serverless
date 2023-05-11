import { useState } from 'react';
import NamespaceTable from './namespacetable';
import NewNamespace from './newns';

const NamespacePage = () => {
    const [open, setOpen] = useState(false);

    return open == false ? <NamespaceTable setOpen={(v) => setOpen(v)} /> : <NewNamespace setOpen={(v) => setOpen(v)} />
}

export default NamespacePage;