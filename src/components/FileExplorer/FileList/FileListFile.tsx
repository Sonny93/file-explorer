import React, { useEffect, useState } from 'react';
import { calculSize } from 'utils';
import { FileFolder } from '../../../types';

import '../../../styles/FileExplorer/FileListFile.scss';

export default function File({ file }: { file: FileFolder; }) {
    const { name, fileContent } = file;
    const [{ size, unit }, setSize] = useState<{ size: number; unit: string; }>(calculSize(0));

    useEffect(() => {
        fileContent
            .getFile()
            .then(({ size }) => setSize(calculSize(size)));
    }, [fileContent]);

    return (
        <li className='file'>
            {name} <span className='size'>— {size} {unit}</span>
        </li>
    );
}