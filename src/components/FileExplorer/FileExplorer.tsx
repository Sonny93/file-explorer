import React from 'react';
import { DirectoryFolder } from 'types';

import './FileExplorer.scss';

export default function FileExplorer({ directory }: { directory: DirectoryFolder | null; }) {
    if (!directory) {
        return (
            <div className='file-explorer'>
                <p className='no-file'>Aucun fichier — dossier ouvert</p>
            </div>
        )
    }

    const { files } = directory;
    if (files.length === 0) {
        return (
            <div className='file-explorer'>
                <p className='no-file'>Aucun fichier</p>
            </div>
        );
    }

    return (<div className='file-explorer'>
        <p>file explorer</p>
    </div>);
}