import React, { useState } from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';
import 'react-resizable/css/styles.css';

import { DirectoryFolder } from 'types';
import Directory from '../FileList/FileListDirectory';

interface SideMenuProps {
    getFolder: () => Promise<void>;
    directory: DirectoryFolder | null;
}
export default function SideMenu({ getFolder, directory }: SideMenuProps) {
    const [width, setWidth] = useState<number>(300);
    const resize = (_event: React.SyntheticEvent, { size }: ResizeCallbackData) => setWidth(size.width);

    return (
        <Resizable
            height={0}
            width={width}
            minConstraints={[250, 0]}
            maxConstraints={[500, 0]}
            onResize={resize}
            axis={'x'}
            resizeHandles={['e']}
        >
            <aside style={{ width }}>
                <button type='button' onClick={getFolder}>Ouvrir un dossier</button>
                <div className='file-list'>
                    {directory
                        ? <Directory directory={directory} opened={true} />
                        : <p className='no-file'>Aucun fichier — dossier ouvert</p>}
                </div>
            </aside>
        </Resizable>
    )
}