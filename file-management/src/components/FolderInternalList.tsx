import * as React from "react";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import {
  FileItem,
  FileManager,
  FolderItem,
  DirItemType,
} from "../processor/FileSystem";
import {
  Divider,
  IconButton,
  ListItem,
  ListSubheader,
  Typography,
  Fab,
  ListItemText,
  ListItemButton,
  List,
} from "@mui/material";
import { DirectoryIcons } from "./DirectoryIcon";
import {
  FolderDeletionAlert,
  ItemRenameAlert,
  NewDirAddAlert,
} from "./FileOperationDialogs";
import { HelpTip } from "./HelpTip";

type AlertBoardOpenHandler = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  index: number,
  type: "File" | "Folder"
) => void;
type RenameBoardOpenHandler = (
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  index: number
) => void;

function FolderInternalListContent(
  fileManager: FileManager,
  openAlert: AlertBoardOpenHandler,
  openRename: RenameBoardOpenHandler,
  selectedInfo: {
    selectedIndex: number;
    editorValue: string;
  },
  setSelectedInfo: React.Dispatch<
    React.SetStateAction<{
      selectedIndex: number;
      editorValue: string;
    }>
  >
): JSX.Element[] {
  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    editorValue: string
  ) => {
    setSelectedInfo({ selectedIndex: index, editorValue: editorValue });
  };

  return fileManager.getCurrentDir().content.map((value) => {
    return (
      <ListItem key={value.id}>
        <ListItemButton
          selected={selectedInfo.selectedIndex === value.id}
          onClick={(event) =>
            handleListItemClick(
              event,
              value.id,
              value.type === "File" ? (value as FileItem).content : "无法编辑"
            )
          }
        >
          <ListItemIcon>{DirectoryIcons(value.name, value.type)}</ListItemIcon>
          <ListItemText
            primary={value.name}
            secondary={
              value.type === "File"
                ? `文件大小：${(value as FileItem).content.length}`
                : `文件个数：${(value as FolderItem).content.length}`
            }
          />
          {selectedInfo.selectedIndex === value.id ? (
            <>
              <HelpTip title={"删除"}>
                <IconButton
                  edge="start"
                  onClick={(e) => openAlert(e, value.id, value.type)}
                >
                  <DeleteIcon />
                </IconButton>
              </HelpTip>
              <HelpTip title={"重命名"}>
                <IconButton edge="end" onClick={(e) => openRename(e, value.id)}>
                  <AutorenewIcon />
                </IconButton>
              </HelpTip>
            </>
          ) : null}
        </ListItemButton>
      </ListItem>
    );
  });
}

function FolderInternalList(
  fileManager: FileManager,
  updateFileManager: React.Dispatch<React.SetStateAction<FileManager>>,
  selectedInfo: {
    selectedIndex: number;
    editorValue: string;
  },
  setSelectedInfo: React.Dispatch<
    React.SetStateAction<{
      selectedIndex: number;
      editorValue: string;
    }>
  >
): JSX.Element {
  const [alertOpen, setAlertOpen] = React.useState({
    open: false,
    target: -1,
    type: "File" as DirItemType,
  });
  const [renameOpen, setRenameOpen] = React.useState({
    open: false,
    target: -1,
  });
  const [createOpen, setCreateOpen] = React.useState({
    open: false,
    type: "File" as DirItemType,
  });

  // 对话窗关闭
  const handleAlertCancel: () => void = () => {
    setAlertOpen({ open: false, target: -1, type: "File" });
  };
  const handleRenameCancel: () => void = () => {
    setRenameOpen({ open: false, target: -1 });
  };
  const handleCreateCancel: () => void = () => {
    setCreateOpen({ ...createOpen, open: false });
  };

  // 对话窗确认
  const handleAlertConfirm: () => void = () => {
    fileManager.dlt(alertOpen.target);
    updateFileManager(fileManager.getCopy());
    setAlertOpen({ open: false, target: -1, type: "File" });
  };
  const handleRenameConfirm: (newName: string) => void = (newName) => {
    fileManager.rename(renameOpen.target, newName);
    updateFileManager(fileManager.getCopy());
    setRenameOpen({ open: false, target: -1 });
  };
  const handleCreateConfirm: (name: string) => void = (name) => {
    fileManager.add(createOpen.type, name);
    updateFileManager(fileManager.getCopy());
    setCreateOpen({ open: false, type: "File" });
  };

  // 打开对话窗
  const openAlert = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number,
    type: DirItemType
  ) => {
    setAlertOpen({ open: true, target: index, type: type });
  };
  const openRename = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    index: number
  ) => {
    setRenameOpen({ open: true, target: index });
  };
  const openCreate = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    type: DirItemType
  ) => {
    setCreateOpen({ open: true, type: type });
  };

  return (
    <>
      <List sx={{ overflow: "auto" }}>
        <ListSubheader>
          <Typography variant="body1" align="center" color={"primary"}>
            {" 当前目录：" + fileManager.getCurrentDir().name}
          </Typography>
          <Divider sx={{ mb: 1, mt: 1 }} />
          <Typography variant="body1" align="center" color={"primary"}>
            <Fab
              variant="extended"
              color="primary"
              size="small"
              onClick={(e) => openCreate(e, "File")}
            >
              <AddIcon />
              新建文件
            </Fab>
            <Fab
              variant="extended"
              color="primary"
              size="small"
              sx={{ ml: 2 }}
              onClick={(e) => openCreate(e, "Folder")}
            >
              <AddIcon />
              新建目录
            </Fab>
            <Divider sx={{ mt: 2 }} />
          </Typography>
          <Divider />
        </ListSubheader>
        {FolderInternalListContent(
          fileManager,
          openAlert,
          openRename,
          selectedInfo,
          setSelectedInfo
        )}
      </List>
      {FolderDeletionAlert(
        alertOpen.open,
        handleAlertCancel,
        handleAlertConfirm,
        alertOpen.type === "File"
          ? "你确定要删除文件吗？"
          : "你确定要删除文件夹吗？",
        alertOpen.type === "File"
          ? "这是不可逆的。"
          : "这将同时删除所有子目录。"
      )}
      {ItemRenameAlert(
        renameOpen.open,
        handleRenameCancel,
        handleRenameConfirm
      )}
      {NewDirAddAlert(
        createOpen.open,
        handleCreateCancel,
        handleCreateConfirm,
        createOpen.type
      )}
    </>
  );
}

export { FolderInternalList };
