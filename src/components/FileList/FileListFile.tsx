import React from 'react';
import { calculSize } from 'utils';
import { FileFolder } from '../../types';

import './FileListFile.scss';

export default function File({ file }: { file: FileFolder; }) {
    const { name, fileContent } = file;

    return (
        <li className='file'>
            {name} — {calculSize(fileContent.size)}
        </li>
    );
}