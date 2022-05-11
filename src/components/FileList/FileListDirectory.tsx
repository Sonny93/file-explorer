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

    if (files.length === 0) {
        return (<>
            <div className='directory'>
                <details open={opened}>
                    <summary>{name}</summary>
                    <p>Aucun fichier</p>
                </details>
            </div>
        </>);
    }

    const toggleOpen = (event: React.SyntheticEvent) => {
        event.preventDefault();
        setOpen(state => !state);
    }

    return (<>
        <div className='directory'>
            <details open={isOpen}>
                <summary onClick={toggleOpen}>
                    {name} — {files.length}
                </summary>
                {isOpen && (
                    <ul>
                        {files.map((file, key) => {
                            if (file.kind === 'directory') {
                                return (<Directory key={key} directory={file as DirectoryFolder} />)
                            } else {
                                return (<File key={key} file={file as FileFolder} />)
                            }
                        })}
                    </ul>
                )}
            </details>
        </div>
    </>);
}