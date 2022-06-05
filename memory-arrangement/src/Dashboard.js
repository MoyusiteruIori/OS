import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Container } from "@mui/system";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import {
  IconButton,
  Badge,
  Divider,
  Paper,
  Link,
  CssBaseline,
  List,
  ListItemText,
  Grid,
  ListItemButton,
  ListItemIcon,
  ListSubheader,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { mainListItems } from "./listItems";
import Controller from "./Controller";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InstructionTable from "./InstructionTable";
import MemoryPages from "./MemoryPages";
import { generateInstructions } from "./Instructions";
import CircularStatic from "./CircularProgressWithLabel";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/MoyusiteruIori">
        1951477-孟宇
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const mdTheme = createTheme();

function initMemPages() {
  let pages = new Array(4);
  for (var i = 0; i < 4; ++i) {
    pages[i] = new Array(10);
    for (var j = 0; j < 10; ++j) pages[i][j] = null;
  }
  console.log(pages);
  return pages;
}

function DashboardContent() {
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const [open, setOpen] = React.useState(true);
  const [memStatus, setMemStatus] = React.useState({
    missingPageNum: 0,
    missingPageRate: 0,
    instructionRows: generateInstructions(),
    pageRows: initMemPages(),
    currentInstID: -1,
    currentPagesInMem: [-1, -1, -1, -1],
    pageInMemTime: [-1, -1, -1, -1], // 4 FIFO
    pageLastUseTime: [-1, -1, -1, -1], // 4 LRU
    runTime: 0,
  });

  const reset = () => {
    global.runningFlag = false;
    global.isPaused = false;
    global.basicSpeed = 500;
    setMemStatus({
      missingPageNum: 0,
      missingPageRate: 0,
      instructionRows: generateInstructions(),
      pageRows: initMemPages(),
      currentInstID: -1,
      currentPagesInMem: [-1, -1, -1, -1],
      pageInMemTime: [-1, -1, -1, -1],
      pageLastUseTime: [-1, -1, -1, -1],
      runTime: 0,
    });
  };

  const getFIFONextStep = (allStatus) => {
    if (allStatus.runTime === 318) {
      global.runningFlag = false;
      global.isPaused = false;
    }
    let newCurrentInstID = 0,
      newCurrentPagesInMem = [...allStatus.currentPagesInMem],
      newPageInMemTime = [...allStatus.pageInMemTime],
      newPageRows = [...allStatus.pageRows],
      newMissingNum = allStatus.missingPageNum,
      newMissingRate = allStatus.missingPageRate,
      newInstructionRows = [...allStatus.instructionRows];

    // 寻找下一条指令
    if (allStatus.currentInstID >= 0) {
      newCurrentInstID =
        allStatus.instructionRows[allStatus.currentInstID].nextAddress;
      while (
        newCurrentInstID ===
          allStatus.instructionRows[newCurrentInstID].nextAddress ||
        allStatus.instructionRows[newCurrentInstID].status === "已执行"
      ) {
        newCurrentInstID = (newCurrentInstID + 1) % 320;
      }
    }

    // 下一条指令所在的页
    let newEnterPage = Math.floor(newCurrentInstID / 10);

    // 下一条指令所在的叶已经在内存中
    if (allStatus.currentPagesInMem.includes(newEnterPage)) {
      console.log("exist");
      newMissingRate = newMissingNum / (allStatus.runTime + 1);
    }
    // 下一条指令所在的叶不在内存中
    else {
      console.log("not exist");
      newMissingNum += 1;
      newMissingRate = newMissingNum / (allStatus.runTime + 1);
      let targetIndex =
        allStatus.currentPagesInMem.indexOf(-1) === -1
          ? allStatus.pageInMemTime.indexOf(
              Math.min(...allStatus.pageInMemTime)
            )
          : allStatus.currentPagesInMem.indexOf(-1);
      newCurrentPagesInMem[targetIndex] = newEnterPage;

      newPageInMemTime[targetIndex] = allStatus.runTime;

      newPageRows[targetIndex] = allStatus.instructionRows.slice(
        newEnterPage * 10,
        newEnterPage * 10 + 10
      );
    }
    newInstructionRows[newCurrentInstID].status = "已执行";

    return {
      ...allStatus,
      missingPageNum: newMissingNum,
      missingPageRate: newMissingRate,
      instructionRows: newInstructionRows,
      currentInstID: newCurrentInstID,
      currentPagesInMem: newCurrentPagesInMem,
      pageInMemTime: newPageInMemTime,
      pageRows: newPageRows,
      runTime: allStatus.runTime + 1,
    };
  };

  const singleFIFO = () => {
    if (memStatus.runTime === 319) {
      return;
    }
    setMemStatus(getFIFONextStep(memStatus));
  };

  const getLRUNextStep = (allStatus) => {
    if (allStatus.runTime === 318) {
      global.runningFlag = false;
      global.isPaused = false;
    }
    let newCurrentInstID = 0,
      newCurrentPagesInMem = [...allStatus.currentPagesInMem],
      newPageLastUseTime = [...allStatus.pageLastUseTime],
      newPageRows = [...allStatus.pageRows],
      newMissingNum = allStatus.missingPageNum,
      newMissingRate = allStatus.missingPageRate,
      newInstructionRows = [...allStatus.instructionRows];

    // 寻找下一条指令
    if (allStatus.currentInstID >= 0) {
      newCurrentInstID =
        allStatus.instructionRows[allStatus.currentInstID].nextAddress;
      while (
        newCurrentInstID ===
          allStatus.instructionRows[newCurrentInstID].nextAddress ||
        allStatus.instructionRows[newCurrentInstID].status === "已执行"
      ) {
        newCurrentInstID = (newCurrentInstID + 1) % 320;
      }
    }

    // 下一条指令所在的页
    let newEnterPage = Math.floor(newCurrentInstID / 10);

    // 下一条指令所在的叶已经在内存中
    if (allStatus.currentPagesInMem.includes(newEnterPage)) {
      newMissingRate = newMissingNum / (allStatus.runTime + 1);
      newPageLastUseTime[
        allStatus.currentPagesInMem.indexOf(newEnterPage)
      ] += 1;
    }
    // 下一条指令所在的叶不在内存中
    else {
      newMissingNum += 1;
      newMissingRate = newMissingNum / (allStatus.runTime + 1);
      let targetIndex =
        allStatus.currentPagesInMem.indexOf(-1) === -1
          ? allStatus.pageLastUseTime.indexOf(
              Math.min(...allStatus.pageLastUseTime)
            )
          : allStatus.currentPagesInMem.indexOf(-1);
      newCurrentPagesInMem[targetIndex] = newEnterPage;

      newPageLastUseTime[targetIndex] = allStatus.runTime;

      newPageRows[targetIndex] = allStatus.instructionRows.slice(
        newEnterPage * 10,
        newEnterPage * 10 + 10
      );
    }
    newInstructionRows[newCurrentInstID].status = "已执行";

    return {
      ...allStatus,
      missingPageNum: newMissingNum,
      missingPageRate: newMissingRate,
      instructionRows: newInstructionRows,
      currentInstID: newCurrentInstID,
      currentPagesInMem: newCurrentPagesInMem,
      pageLastUseTime: newPageLastUseTime,
      pageRows: newPageRows,
      runTime: allStatus.runTime + 1,
    };
  };

  const singleLRU = () => {
    if (memStatus.runTime === 319) {
      return;
    }
    setMemStatus(getLRUNextStep(memStatus));
  };

  const continousFIFO = () => {
    global.runningFlag = true;
    let timer = setInterval(() => {
      if (global.runningFlag === false || global.isPaused === true) {
        console.log("time to leave");
        clearInterval(timer);
      } else setMemStatus((memStatus) => getFIFONextStep(memStatus));
    }, global.basicSpeed);
  };

  const continousLRU = () => {
    global.runningFlag = true;
    let timer = setInterval(() => {
      if (global.runningFlag === false || global.isPaused === true) {
        console.log("time to leave");
        clearInterval(timer);
      } else setMemStatus((memStatus) => getLRUNextStep(memStatus));
    }, global.basicSpeed);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              同济大学软件学院 2022B 操作系统课程项目2：内存管理
            </Typography>
            <IconButton color="inherit">
              <Badge color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />

          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            <React.Fragment>
              <ListSubheader component="div" inset>
                执行统计
              </ListSubheader>
              <ListItemButton>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="缺页数:" />
              </ListItemButton>
              <ListItemButton>
                <ListItemText
                  primary={memStatus.missingPageNum}
                  sx={{ textAlign: "center" }}
                />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="缺页率：" />
              </ListItemButton>
              <Box display="flex" justifyContent="center" flexDirection="row">
                <CircularStatic missingPageRate={memStatus.missingPageRate} />
              </Box>
            </React.Fragment>
          </List>
        </Drawer>
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
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "rgba(135,206,250,0.2)",
                  }}
                >
                  <MemoryPages
                    pages={memStatus.pageRows}
                    instructions={memStatus.instructionRows}
                  />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "rgba(135,206,250,0.2)",
                  }}
                >
                  <Controller
                    initInstructions={reset}
                    singleFIFO={singleFIFO}
                    singleLRU={singleLRU}
                    continousFIFO={continousFIFO}
                    continousLRU={continousLRU}
                    memStatus={memStatus}
                    nextInstId={
                      memStatus.currentInstID < 0
                        ? 0
                        : memStatus.instructionRows[memStatus.currentInstID]
                            .nextAddress
                    }
                  />
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "rgba(135,206,250,0.2)",
                  }}
                >
                  <InstructionTable rows={memStatus.instructionRows} />
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  return <DashboardContent />;
}
