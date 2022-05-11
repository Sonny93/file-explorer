import { DirectoryFolder, FileFolder } from "types";

export async function handleContent(directoryHandle: FileSystemDirectoryHandle) {
    const directory = {
        kind: directoryHandle.kind,
        name: directoryHandle.name,
        files: await handleDirectory(directoryHandle)
    };
    return directory;
}

export async function handleDirectory(directoryHandle: FileSystemDirectoryHandle) {
    const folder = [] as Array<DirectoryFolder | FileFolder>;
    // @ts-ignore: values n'existe pas dans la def typescript de VSCode mais la méthode existe
    for await (const content of directoryHandle.values()) {
        let obj;
        if (content.kind === 'file') {
            obj = {
                kind: content.kind,
                name: content.name,
                fileContent: await content.getFile()
            } as FileFolder;
        } else {
            obj = {
                kind: content.kind,
                name: content.name,
                files: await handleDirectory(content)
            } as DirectoryFolder;
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

/**
 * Fonction permettant de transformer une valeur de bit brute en une chaîne de caractère human-friendly 
 * @param {number} value Valeur brute
 * @param {number} decimals Nombre de decimal 
 * @returns {string} Valeur avec unité (ex: 1000 Ko)
 */
export function calculSize(value: bigint | number = BigInt(0), decimals: number = 2) {
    const octets = Number(value);
    if (octets === 0) return '0 Octet';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To', 'Po', 'Eo', 'Zo', 'Yo'];

    const i = Math.floor(Math.log(octets) / Math.log(k));

    return `${parseFloat((octets / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}