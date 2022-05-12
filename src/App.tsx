import React, { useState } from 'react';
// @ts-ignore
import nprogress from 'nprogress';

import FileExplorer from 'components/FileExplorer/FileExplorer';
import SideMenu from 'components/SideMenu/SideMenu';

import { DirectoryFolder, FileFolder } from './types';
import { calculSize, handleContent, prettyPrintNumber } from './utils';

import 'nprogress/nprogress.css';
import './App.scss';

declare const window: any;

function App() {
	const [directory, setDirectory] = useState<DirectoryFolder | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const [directoryCount, setDirectoryCount] = useState<number>(0);
	const [filesCount, setFilesCount] = useState<number>(0);
	const [totalSize, setTotalSize] = useState<number>(0);

	if (!('showDirectoryPicker' in window)) {
		setTotalSize(0)
		return (
			<p style={{ color: 'red', fontSize: '2em', textTransform: 'uppercase' }}>
				Navigateur incompatible
			</p>
		)
	}

	const resetStates = () => {
		setFilesCount(0);
		setDirectoryCount(0);
		setDirectory(null);
	}

	const getFolder = async () => {
		resetStates();
		const content = await window.showDirectoryPicker();

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
				directory={directory}
			/>
			<div className='wrapper-content'>
				<span>{prettyPrintNumber(filesCount)} fichiers</span>
				<span>{prettyPrintNumber(directoryCount)} dossiers</span>
				<span>{calculSize(totalSize)}</span>
				{loading
					? (<p>Chargement en cours...</p>)
					: <FileExplorer directory={directory} />}
			</div>
		</div>
	);
}

export default App;