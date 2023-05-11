import { useState } from 'react';

import TableFaas from './tablefaas';
import NewFunc from './newfunc';

const FuncPage = () => {
    const [open, setOpen] = useState(false);
    return open == false ? <TableFaas setOpen={(v) => setOpen(v)} /> : <NewFunc setOpen={(v) => setOpen(v)} />
}

export default FuncPage;