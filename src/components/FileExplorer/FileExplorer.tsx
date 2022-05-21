import React from 'react';
import 'react-resizable/css/styles.css';

import Directory from './FileList/FileListDirectory';
import { DirectoryFolder } from '../../types';

import '../../styles/FileExplorer/FileExplorer.scss'

export default function FileExplorer({ directory }: { directory: DirectoryFolder | null }) {
    return (
        <div className='file-explorer'>
            <div className='file-list'>
                {directory
                    ? <Directory directory={directory} opened={true} />
                    : <p className='no-file'>Aucun fichier — dossier ouvert</p>}
            </div>
        </div>
    )
}