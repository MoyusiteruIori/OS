import { stringMult, includes } from '../utils';


type DirItemType = 'File' | 'Folder';

interface DirectoryItem {
    id: number
    name: string,
    type: DirItemType
}

interface FileItem extends DirectoryItem {
    content: string
}

interface FolderItem extends DirectoryItem {
    content: DirectoryItem[]
}

class FileManager {
    private currentDir: number
    private dirMaxIdx: number
    private root: FolderItem

    constructor(
        cd: number = 0, 
        dmi: number = 0, 
        rt: FolderItem = {
            id: 0,
            name: 'root',
            type: 'Folder',
            content: []
        }
    ) {
        this.currentDir = cd;
        this.dirMaxIdx = dmi;
        this.root = rt;
    }

    private _findDir: (id: number, start: FolderItem, type: 'DIR' | 'SELF' | 'PARENT') => false | DirectoryItem = (id, start, type) => {
        if (id === start.id) 
            return start;
        
        for (var i = 0; i < start.content.length; ++i) {
            if (start.content[i].id === id) {
                if (type === 'SELF')
                    return start.content[i];
                if (type === 'PARENT')
                    return start;
                return (start.content[i].type === 'Folder' ? start.content[i] : start)
            }
            else if (start.content[i].type === 'Folder') {
                var subSearch = this._findDir(id, start.content[i] as FolderItem, type);
                if (subSearch !== false)
                    return subSearch;
            }
        }
        return false;
    }
    public findDir: (id: number, type: 'DIR' | 'SELF' | 'PARENT') => false | DirectoryItem = (id, type) => {
        return this._findDir(id, this.root, type);
    }

    private _printAll: (dir: DirectoryItem, lv: number) => void = (dir, lv) => {
        console.log(stringMult(' ', lv) + dir.name + ` id:${dir.id}` + `${dir.id === this.currentDir ? ' cur' : ''}`);
        if (dir.type === 'File')
            return;
        for (var i = 0; i < (dir as FolderItem).content.length; ++i) {
            this._printAll((dir as FolderItem).content[i], lv + 1);
        }
    }
    public printAll: () => void = () => {
        this._printAll(this.root, 0);
    }

    public enterDir: (id: number) => boolean = (id) => {
        var targetDir = this.findDir(id, 'DIR');
        if (targetDir !== false) {
            this.currentDir = targetDir.id;
            return true;
        }
        return false;
    }

    public add: (type: DirItemType, name: string) => boolean = (type, name) => {
        var curDir = this.findDir(this.currentDir, 'DIR') as FolderItem;

        // 同级目录内的文件名不能重复
        if (includes<DirectoryItem>(curDir.content, (dirItem: DirectoryItem) => dirItem.name === name))
            return false;

        var newItem = {
            id: ++(this.dirMaxIdx),
            type: type,
            name: name
        }
        curDir.content.push(
            (type === 'Folder' ? {
                ...newItem,
                content: []
            } as FolderItem : {
                ...newItem,
                content: ''
            } as FileItem)
        );
        return true;
    }

    public rename: (id: number, newName: string) => boolean = (id, newName) => {
        var targetDir = this.findDir(id, "SELF");
        if (targetDir === false)
            return false;
        targetDir.name = newName;
        return true;
    }

    public dlt: (id: number) => boolean = (id) => {
        var targetDir = this.findDir(id, "PARENT");
        if (targetDir === false)
            return false;
        (targetDir as FolderItem).content = (targetDir as FolderItem).content.filter((dir) => dir.id !== id);
        return true;
    }


    public edit: (id: number, content: string) => boolean = (id, content) => {
        var targetDir = this.findDir(id, "SELF");
        if (targetDir === false || targetDir.type === "Folder")
            return false;
        (targetDir as FileItem).content = content;
        return true;
    } 


    public getState: () => FolderItem = () => {
        return this.root;
    }

    public getCurrentDir: () => FolderItem = () => {
        return this.findDir(this.currentDir, 'DIR') as FolderItem;
    }

    public getCopy: () => FileManager = () => {
        var copy = new FileManager();
        copy.currentDir = this.currentDir;
        copy.root = {...this.root};
        copy.dirMaxIdx = this.dirMaxIdx
        return copy;
    }
}

export { FileManager }
export type { DirectoryItem, FileItem, FolderItem, DirItemType }