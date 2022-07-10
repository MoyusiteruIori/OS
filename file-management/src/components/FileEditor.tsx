import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import * as React from "react";
import { FileManager, DirectoryItem, FileItem } from "../processor/FileSystem";

function getEditorLabel(
  fileManager: FileManager,
  selectedIndex: number
): string {
  var selected = fileManager.findDir(selectedIndex, "SELF");
  if (selected !== false) return "当前编辑文件：" + (selected as FileItem).name;
  return "";
}

function FileEditor(
  fileManager: FileManager,
  setFileManager: React.Dispatch<React.SetStateAction<FileManager>>,
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
  const onSaveClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    fileManager.edit(selectedInfo.selectedIndex, selectedInfo.editorValue);
    setFileManager(fileManager.getCopy());
  };

  return (
    <>
      <TextField
        id="filled-multiline-static"
        label={getEditorLabel(fileManager, selectedInfo.selectedIndex)}
        multiline
        rows={25}
        variant="filled"
        disabled={
          fileManager.findDir(selectedInfo.selectedIndex, "SELF") === false ||
          (
            fileManager.findDir(
              selectedInfo.selectedIndex,
              "SELF"
            ) as DirectoryItem
          ).type === "Folder"
        }
        onChange={(e) =>
          setSelectedInfo({ ...selectedInfo, editorValue: e.target.value })
        }
        value={selectedInfo.editorValue}
      />
      <Button variant="contained" onClick={onSaveClick} sx={{ mt: 1 }}>
        保存修改
      </Button>
    </>
  );
}

export { FileEditor };
