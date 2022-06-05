import * as React from "react";
import Typography from "@mui/material/Typography";
import {
  MenuItem,
  Paper,
  FormControl,
  InputLabel,
  Select,
  Button,
  Grid,
  Divider,
  ButtonGroup,
  Box
} from "@mui/material";
import toPercent from "./utils";
import SpeedSlider from "./MySlider";

export default function Controller(props) {
  const [algorithm, setAlgorithm] = React.useState(10);
  const handleChange = (e) => {
    setAlgorithm(e.target.value);
  };
  const pause = () => {
    global.isPaused = true;
  };
  const continueAuto = () => {
    console.log("xixi", props.memStatus.runTime);
    if (global.isPaused === false && global.runningFlag === true) return;
    global.isPaused = false;
    if (algorithm === 10) props.continousFIFO();
    else props.continousLRU();
  };
  const setSpeed = (e) => {
    let val = e.target.value;
    global.basicSpeed -= (val - 50);
  }

  return (
    <React.Fragment>
      <Typography component="p" variant="h5" mb={2}>
        控制台
      </Typography>
      <Divider />
      <FormControl
        sx={{ m: 1, minWidth: 80 }}
        disabled={props.memStatus.currentInstID !== -1}
      >
        <InputLabel id="demo-simple-select-autowidth-label">
          替换算法
        </InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          autoWidth
          label="替换算法"
          defaultValue={10}
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>FIFO</MenuItem>
          <MenuItem value={20}>LRU</MenuItem>
        </Select>
      </FormControl>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          指令数：320
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          页数：32
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          内存帧数：4
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          已执行周期数：{props.memStatus.runTime}
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          缺页数：{props.memStatus.missingPageNum}
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          缺页率：{toPercent(props.memStatus.missingPageRate)}
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          当前指令地址：{props.memStatus.currentInstID}
        </Typography>
        <Typography color="text.secondary" sx={{ flex: 1 }}>
          下条指令地址：{props.nextInstId}
        </Typography>
      </Paper>
      <Grid container mt={1} mb={1} spacing={1}>
        <Grid item xs={12} lg={6}>
          <Button
            variant="contained"
            onClick={
              algorithm === 10
                ? props.singleFIFO
                : algorithm === 20
                ? props.singleLRU
                : null
            }
          >
            {"> 单步执行"}
          </Button>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Button
            variant="contained"
            onClick={
              algorithm === 10
                ? props.continousFIFO
                : algorithm === 20
                ? props.continousLRU
                : null
            }
            disabled={global.runningFlag || props.memStatus.runTime >= 319}
          >
            {">> 连续执行"}
          </Button>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Button
            variant="contained"
            color="error"
            onClick={props.initInstructions}
          >
            {"重置"}
          </Button>
        </Grid>
        {global.runningFlag ? (
          <Grid item xs={12} lg={8} ml={2}>
          <ButtonGroup>
            <Button
              variant="contained"
              color="success"
              disabled={props.memStatus.runTime === 0}
              onClick={pause}
            >
              {"暂停"}
            </Button>

            <Button
              variant="contained"
              color="success"
              disabled={props.memStatus.runTime === 0}
              onClick={continueAuto}
            >
              {"继续"}
            </Button>
          </ButtonGroup>
          </Grid>
        ) : null}
      </Grid>
      <Box sx={{ m: 1 }} />
      <Typography gutterBottom>连续执行速度</Typography>
      <SpeedSlider
        valueLabelDisplay="auto"
        aria-label="pretto slider"
        defaultValue={50}
        onChange={setSpeed}
        disabled={global.runningFlag}
      />
    </React.Fragment>
  );
}
