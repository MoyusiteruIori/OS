import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import { FileManager, FolderItem } from "../processor/FileSystem";
import { Divider, ListItem, ListSubheader } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import { ExpandMore } from "@mui/icons-material";
import { DirectoryIcons } from "./DirectoryIcon";

function NestedListContent(
  fileManager: FileManager,
  directory: FolderItem,
  update: React.Dispatch<React.SetStateAction<FileManager>>,
  lv: number
): JSX.Element[] {
  const onDirSelected: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    dirId: number
  ) => void = (event, dirId) => {
    fileManager.enterDir(dirId);
    update(fileManager.getCopy());
  };

  return directory.content.map((value) => {
    if (value.type === "File")
      return (
        <ListItem key={value.id}>
          <ListItemButton onClick={(event) => onDirSelected(event, value.id)}>
            <ListItemIcon>
              {DirectoryIcons(value.name, value.type)}
            </ListItemIcon>
            <ListItemText primary={value.name} />
          </ListItemButton>
        </ListItem>
      );
    else
      return (
        <>
          <ListItem key={value.id}>
            <ListItemButton onClick={(event) => onDirSelected(event, value.id)}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary={value.name} />
              {/* <ExpandMore /> */}
            </ListItemButton>
          </ListItem>
          <Collapse in={true} sx={{ pl: lv }}>
            <List dense>
              {NestedListContent(
                fileManager,
                value as FolderItem,
                update,
                lv + 2
              )}
            </List>
          </Collapse>
        </>
      );
  });
}

function NestedList(
  fileManager: FileManager,
  update: React.Dispatch<React.SetStateAction<FileManager>>
): JSX.Element {
  const onRootSelected: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    dirId: number
  ) => void = (event, dirId) => {
    fileManager.enterDir(dirId);
    update(fileManager.getCopy());
  };
  return (
    <List sx={{ overflow: "auto" }} dense>
      <ListSubheader>
        <Typography variant="body1" align="center" color={"primary"}>
          {"目录选择视图"}
        </Typography>
      </ListSubheader>
      <Divider sx={{ mt: 1 }} />
      <ListItem key={0}>
        <ListItemButton onClick={(event) => onRootSelected(event, 0)}>
          <ListItemIcon>{DirectoryIcons("root", "Folder")}</ListItemIcon>
          <ListItemText primary={"root"} />
          <ExpandMore />
        </ListItemButton>
      </ListItem>
      <Collapse in={true}>
        <List dense sx={{ pl: 2 }}>
          {NestedListContent(fileManager, fileManager.getState(), update, 2)}
        </List>
      </Collapse>
    </List>
  );
}

export { NestedList };
