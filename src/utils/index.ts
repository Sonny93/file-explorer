import { DirectoryFolder, FileFolder } from '../types';

export async function handleDirectory(directoryHandle: FileSystemDirectoryHandle, callback?: (file: DirectoryFolder | FileFolder) => void) {
    const folder = [] as Array<DirectoryFolder | FileFolder>;
    // @ts-ignore: values n'existe pas dans la def typescript de VSCode mais la méthode existe
    for await (const content of directoryHandle.values()) {
        let obj: DirectoryFolder | FileFolder;
        if (content.kind === 'file') {
            obj = FileFolderBuilder(content);
        } else {
            const files = await handleDirectory(content, callback);
            obj = DirectoryFolderBuilder(content, files);
        }

        if (callback) {
            callback(obj);
        }

        folder.push(obj);
    }

    return folder.sort((a, b) => {
        if (a.kind < b.kind) {
            return -1;
        } else if (a.kind > b.kind) {
            return 1;
        } else {
            return 0;
        }
    });
}

export function DirectoryFolderBuilder({ kind, name }: FileSystemDirectoryHandle, files: Array<DirectoryFolder | FileFolder>): DirectoryFolder {
    return {
        kind,
        name,
        files,
        size: 0
    } as DirectoryFolder;
}

export function FileFolderBuilder(file: FileSystemFileHandle) {
    return {
        kind: file.kind,
        name: file.name,
        fileContent: file
    }
}

/**
 * Fonction permettant de transformer une valeur de bit brute en une chaîne de caractère human-friendly 
 * @param {number} value Valeur brute
 * @param {number} decimals Nombre de decimal 
 * @returns {string} Valeur avec unité (ex: 1000 Ko)
 */
export function calculSize(value: bigint | number = BigInt(0), decimals: number = 2): { size: number; unit: string; } {
    const octets = Number(value);
    const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'];

    if (octets === 0) return { size: 0, unit: sizes[0] };

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;

    const i = Math.floor(Math.log(octets) / Math.log(k));

    return { size: parseFloat((octets / Math.pow(k, i)).toFixed(dm)), unit: sizes[i] };
}

export function prettyPrintNumber(value: bigint | number = BigInt(0)): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}