import React, { useState } from 'react';
// @ts-ignore
import nprogress from 'nprogress';

import FileExplorer from 'components/FileExplorer/FileExplorer';
import SideMenu from 'components/SideMenu';

import { DirectoryFolder, FileFolder } from './types';
import { handleContent } from './utils';

import 'nprogress/nprogress.css';
import './styles/App.scss';

declare const window: any;

function App() {
	const [directory, setDirectory] = useState<DirectoryFolder | null>(null);

	const [loading, setLoading] = useState<boolean>(false);
	const [isFolderSelected, setIsFolderSelected] = useState<boolean>(false);

	const [directoryCount, setDirectoryCount] = useState<number>(0);
	const [filesCount, setFilesCount] = useState<number>(0);
	const [totalSize, setTotalSize] = useState<number>(0);

	if (!('showDirectoryPicker' in window)) {
		setTotalSize(0);
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
		const content = await window.showDirectoryPicker();

		setIsFolderSelected(true);
		setLoading(true);
		nprogress.start();

		const directory = await handleContent(content, (file: DirectoryFolder | FileFolder) => {
			if (file.kind === 'directory') {
				setDirectoryCount((state) => state + 1);
			} else {
				setFilesCount((state) => state + 1);
				(file as FileFolder)
					.fileContent
					.getFile()
					.then((file) => setTotalSize((state) => state + file.size))
					.catch(console.error);
			}
		}) as DirectoryFolder;

		setLoading(false);
		nprogress.done();

		setDirectory(directory);
	}

	return (
		<div className='App'>
			<SideMenu
				getFolder={getFolder}
				loading={loading}
				isFolderSelected={isFolderSelected}
				filesCount={filesCount}
				directoryCount={directoryCount}
				totalSize={totalSize}
			/>
			<FileExplorer
				directory={directory}
			/>
		</div>
	);
}

export default App;