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
    directoryCount: number;
    filesCount: number;
    uncomputedFiles: number;
    totalSize: number;
    computeTime: number;
}
export default function SideMenu({
    getFolder,
    loading,
    isFolderSelected,
    directoryCount = 0,
    filesCount = 0,
    uncomputedFiles = 0,
    totalSize,
    computeTime = 0
}: SideMenuProps) {
    const [width, setWidth] = useState<number>(Number(localStorage.getItem(SIDEBAR_LOCALSTORAGE_KEY) || SIDEBAR_DEFAULT_SIZE));
    const { size, unit } = calculSize(totalSize);
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
                    <div className='menu-field stats'>
                        <details open>
                            <summary>
                                Statistiques
                            </summary>
                            <ul>
                                <li>
                                    <span>{prettyPrintNumber(filesCount)}</span>
                                    <span>fichiers</span>
                                </li>
                                <li>
                                    <span>{prettyPrintNumber(directoryCount)}</span>
                                    <span>dossiers</span>
                                </li>
                                <li>
                                    <span>{prettyPrintNumber(totalCount)}</span>
                                    <span>total</span>
                                </li>
                                <li>
                                    <span>{prettyPrintNumber(uncomputedFiles)}</span>
                                    <span>fichiers non traités</span>
                                </li>
                                <li>
                                    <span>{size} {unit}</span>
                                    <span>poids total</span>
                                </li>
                                <li>
                                    <span>{computeTime}s</span>
                                    <span>temps calcul</span>
                                </li>
                            </ul>
                        </details>
                    </div>
                </>)}
            </aside>
        </Resizable>
    </>);
}