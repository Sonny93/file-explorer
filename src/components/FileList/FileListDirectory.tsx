import React, { useState } from 'react';

import File from './FileListFile';
import { DirectoryFolder, FileFolder } from '../../types';

import './FileListDirectory.scss';

interface DirectoryProps {
    directory: DirectoryFolder;
    opened?: boolean;
}
export default function Directory({ directory, opened = false }: DirectoryProps) {
    const { name, files } = directory;
    const [isOpen, setOpen] = useState<boolean>(opened);

    const toggleOpen = (event: React.SyntheticEvent) => {
        event.preventDefault();
        setOpen(state => !state);
    }

    return (<>
        <div className='directory'>
            <details open={isOpen}>
                <summary onClick={toggleOpen}>
                    {name}<span className="size"> — {files.length}</span>
                </summary>
                {isOpen && (
                    <ul>
                        {files.length > 0 ? (
                            files.map((file, key) => {
                                if (file.kind === 'directory') {
                                    return (<Directory key={key} directory={file as DirectoryFolder} />)
                                } else {
                                    return (<File key={key} file={file as FileFolder} />)
                                }
                            })
                        ) : <li className='no-file'>Aucun fichier — dossier</li>}
                    </ul>
                )}
            </details>
        </div>
    </>);
}