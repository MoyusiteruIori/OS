import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { DirItemType } from "../processor/FileSystem";

// 删除文件时的弹窗
function FolderDeletionAlert(
  open: boolean,
  handleCancel: () => void,
  handleConfirm: () => void,
  title: string,
  content: string
): JSX.Element {
  return (
    <div>
      <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>再想想</Button>
          <Button onClick={handleConfirm} autoFocus>
            我知道我在做什么
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// 重命名文件时的弹窗
function ItemRenameAlert(
  open: boolean,
  handleCancel: () => void,
  handleConfirm: (newName: string) => void
): JSX.Element {
  const [newName, setNewName] = React.useState("");
  const onTextInput = (content: string) => {
    setNewName(content);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle id="alert-dialog-title">{"重命名文件或目录"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {"重命名文件或目录"}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="新目录名"
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => onTextInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>取消</Button>
          <Button onClick={(e) => handleConfirm(newName)} autoFocus>
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// 新建目录时的弹窗
function NewDirAddAlert(
  open: boolean,
  handleCancel: () => void,
  handleConfirm: (name: string) => void,
  type: DirItemType
): JSX.Element {
  const [name, setName] = React.useState("");
  const onTextInput = (content: string) => {
    setName(content);
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle id="alert-dialog-title">
          {type === "File" ? "新建文件" : "新建目录"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`输入${type === "File" ? "文件" : "目录"}名`}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={type === "File" ? "文件名" : "目录名"}
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => onTextInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>取消</Button>
          <Button onClick={(e) => handleConfirm(name)} autoFocus>
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export { FolderDeletionAlert, ItemRenameAlert, NewDirAddAlert };
