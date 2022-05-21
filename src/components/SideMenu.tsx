import React, { useState } from 'react';
import { Resizable, ResizeCallbackData } from 'react-resizable';

import { calculSize, prettyPrintNumber } from 'utils';

import '../styles/SideMenu.scss';

const SIDEBAR_LOCALSTORAGE_KEY: string = '__sidebar_width';

const RESIZE_CONSTS_MIN: [number, number] = [310, 0];
const RESIZE_CONSTS_MAX: [number, number] = [500, 0];

const SIDEBAR_DEFAULT_SIZE: number =
    ((RESIZE_CONSTS_MAX[0] - RESIZE_CONSTS_MIN[0]) / 2) + RESIZE_CONSTS_MIN[0];

interface SideMenuProps {
    getFolder: () => Promise<void>;
    loading: boolean;
    isFolderSelected: boolean;
    filesCount: number;
    directoryCount: number;
    totalSize: number;
}
export default function SideMenu({
    getFolder,
    loading,
    isFolderSelected,
    filesCount = 0,
    directoryCount = 0,
    totalSize
}: SideMenuProps) {
    const [width, setWidth] = useState<number>(Number(localStorage.getItem(SIDEBAR_LOCALSTORAGE_KEY) || SIDEBAR_DEFAULT_SIZE));
    const totalCount = filesCount + directoryCount;

    const resize = (_event: React.SyntheticEvent, { size }: ResizeCallbackData) => {
        setWidth(size.width);
        localStorage.setItem(SIDEBAR_LOCALSTORAGE_KEY, size.width.toString());
    };

    return (<>
        <Resizable
            height={0}
            width={width}
            minConstraints={RESIZE_CONSTS_MIN}
            maxConstraints={RESIZE_CONSTS_MAX}
            onResize={resize}
            axis={'x'}
            resizeHandles={['e']}
        >
            <aside style={{ width }} className='side-menu'>
                <button type='button' onClick={getFolder} disabled={isFolderSelected && loading}>
                    Ouvrir un dossier
                </button>
                <div className='menu-field status'>
                    {isFolderSelected
                        ? (
                            <span className={loading ? 'in-progress' : 'finish'}>
                                Statut: {loading ? 'en cours' : 'terminé'}
                            </span>
                        ) : (
                            <span className='no-folder'>
                                Statut: Aucun dosser
                            </span>
                        )}
                </div>
                {isFolderSelected && (<>
                    <div className='menu-field'>
                        <details open>
                            <summary>
                                Total fichiers/dossiers : {prettyPrintNumber(totalCount)}
                            </summary>
                            <ul>
                                <li>{prettyPrintNumber(filesCount)} fichiers</li>
                                <li>{prettyPrintNumber(directoryCount)} dossiers</li>
                                <li>{calculSize(totalSize)}</li>
                            </ul>
                        </details>
                    </div>
                </>)}
            </aside>
        </Resizable>
    </>);
}