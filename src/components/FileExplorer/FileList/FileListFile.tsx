import React, { useEffect, useState } from 'react';
import { calculSize } from 'utils';
import { FileFolder } from '../../../types';

import '../../../styles/FileExplorer/FileListFile.scss';

export default function File({ file }: { file: FileFolder; }) {
    const { name, fileContent } = file;
    const [size, setSize] = useState<number>(0);

    useEffect(() => {
        fileContent
            .getFile()
            .then(({ size }) => setSize(size));
    }, [fileContent]);

    return (
        <li className='file'>
            {name} — {calculSize(size)}
        </li>
    );
}