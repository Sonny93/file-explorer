import React, { useState } from 'react';
// @ts-ignore
import nprogress from 'nprogress';

import FileExplorer from 'components/FileExplorer/FileExplorer';
import SideMenu from 'components/SideMenu';

import { DirectoryFolder, FileFolder } from './types';
import { DirectoryFolderBuilder, handleDirectory } from './utils';

import 'nprogress/nprogress.css';
import './styles/App.scss';

declare const window: any;

function App() {
	const [directory, setDirectory] = useState<DirectoryFolder | null>(null);

	const [loading, setLoading] = useState<boolean>(false);
	const [isFolderSelected, setIsFolderSelected] = useState<boolean>(false);

	const [directoryCount, setDirectoryCount] = useState<number>(0);
	const [filesCount, setFilesCount] = useState<number>(0);
	const [uncomputedFiles, setUncomputedFiles] = useState<number>(0);
	const [totalSize, setTotalSize] = useState<number>(0);
	const [computeTime, setComputeTime] = useState<number>(0);

	if (!('showDirectoryPicker' in window)) {
		return (
			<p style={{ color: 'red', fontSize: '2em', textTransform: 'uppercase' }}>
				Navigateur incompatible
			</p>
		);
	}

	const resetStates = () => {
		setFilesCount(0);
		setDirectoryCount(0);
		setDirectory(null);
		setIsFolderSelected(false);
	}

	const getFolder = async () => {
		resetStates();
		const directoryHandle = await window.showDirectoryPicker();

		const intervalCompute = setInterval(() => setComputeTime((props) => props + 1), 1000);
		nprogress.start();

		setIsFolderSelected(true);
		setLoading(true);

		const files = await handleDirectory(directoryHandle, (file: DirectoryFolder | FileFolder) => {
			if (file.kind === 'directory') {
				setDirectoryCount((state) => state + 1);
			} else {
				setFilesCount((state) => state + 1);
				(file as FileFolder)
					.fileContent
					.getFile()
					.then((file) => setTotalSize((state) => state + file.size))
					.catch((error) => {
						setUncomputedFiles((props) => props + 1);
						console.error(file.kind, file.name, error);
					});
			}
		});
		const directory = DirectoryFolderBuilder(directoryHandle, files);

		setLoading(false);
		clearInterval(intervalCompute);
		nprogress.done();

		setDirectory(directory);
	}

	return (
		<div className='App'>
			<SideMenu
				getFolder={getFolder}
				loading={loading}
				isFolderSelected={isFolderSelected}
				directoryCount={directoryCount}
				filesCount={filesCount}
				uncomputedFiles={uncomputedFiles}
				totalSize={totalSize}
				computeTime={computeTime}
			/>
			<FileExplorer
				directory={directory}
			/>
		</div>
	);
}

export default App;
