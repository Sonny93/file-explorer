export interface DirectoryFolder {
    kind: string;
    name: string;
    files: DirectoryFolder[] | FileFolder[];
    size: number;
}

export interface FileFolder {
    kind: string;
    name: string;
    fileContent: FileSystemFileHandle;
}