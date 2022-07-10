import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { NestedList } from "./NestedList";
import { FolderInternalList } from "./FolderInternalList";
import { FileManager } from "../processor/FileSystem";
import { FileEditor } from "./FileEditor";
import { HelpTip } from "./HelpTip";

const help: string =
  "这是一个简单的文件管理系统模拟：在左侧的目录选择视图进行单击选择可以切换当前目录；" +
"在中间的当前目录视图中单击可以选中并进行删除或重命名；" + 
"当选中文件时，在右侧的文件编辑器目录可以对当前选中的文件进行编辑和保存。";

function Copyright(props: any): JSX.Element {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/MoyusiteruIori">
        1951477 孟宇
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function DashboardContent(): JSX.Element {
  const [fileManager, setFileManager] = React.useState(new FileManager());
  const [selectedInfo, setSelectedInfo] = React.useState({
    selectedIndex: -1,
    editorValue: "无法编辑",
  });

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <MuiAppBar>
        <Toolbar>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            {"同济大学软件学院 2022B 操作系统课程项目3：文件管理"}
          </Typography>
          <IconButton color="inherit">
            <HelpTip title={help}>
              <HelpOutlineIcon />
            </HelpTip>
          </IconButton>
        </Toolbar>
      </MuiAppBar>

      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Toolbar />
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 750,
                }}
              >
                {NestedList(fileManager, setFileManager)}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: 750,
                }}
              >
                {FolderInternalList(
                  fileManager,
                  setFileManager,
                  selectedInfo,
                  setSelectedInfo
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="body1" align="center" color={"primary"}>
                  {"文件编辑器"}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                {FileEditor(
                  fileManager,
                  setFileManager,
                  selectedInfo,
                  setSelectedInfo
                )}
              </Paper>
            </Grid>
          </Grid>
          <Copyright sx={{ pt: 4 }} />
        </Container>
      </Box>
    </Box>
  );
}

export default function Dashboard(): JSX.Element {
  return <DashboardContent />;
}
