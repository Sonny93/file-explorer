import React, { useState } from 'react';
// @ts-ignore
import nprogress from 'nprogress';

import FileExplorer from 'components/FileExplorer/FileExplorer';
import SideMenu from 'components/SideMenu/SideMenu';

import { DirectoryFolder } from './types';
import { handleContent } from './utils';

import 'nprogress/nprogress.css';
import './App.scss';

declare const window: any;

function App() {
	const [directory, setDirectory] = useState<DirectoryFolder | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	if (!('showDirectoryPicker' in window)) {
		return (
			<p style={{ color: 'red', fontSize: '2em', textTransform: 'uppercase' }}>
				Navigateur incompatible
			</p>
		)
	}

	const getFolder = async () => {
		const content = await window.showDirectoryPicker();

		setLoading(true);
		nprogress.start();

		const directory = await handleContent(content) as DirectoryFolder;

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
				{loading
					? <p>Chargement en cours...</p>
					: <FileExplorer directory={directory} />}
			</div>
		</div>
	);
}



export default App;