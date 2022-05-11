export interface DirectoryFolder {
    kind: string;
    name: string;
    files: DirectoryFolder[] | FileFolder[];
}

export interface FileFolder {
    kind: string;
    name: string;
    fileContent: File;
}