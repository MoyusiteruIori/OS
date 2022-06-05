import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  List,
  ListItemButton,
  Box,
  ListItem,
  ListItemText,
  ListSubheader,
  Grid,
  Divider,
  Typography,
  Button,
  ListItemIcon,
  Checkbox,
} from "@mui/material";

function zip(arrays) {
  return arrays[0].map(function (_, i) {
    return arrays.map(function (array) {
      return array[i];
    });
  });
}

function pages(pageRows) {
  return [0, 1, 2, 3].map((frameId) => (
    <Grid item xs={12} md={3} key={frameId}>
      <Demo>
        <List dense sx={{ lineHeight: "20px" }} key={`Frame${frameId + 1}`}>
          <ListSubheader component="div" sx={{ textAlign: "center" }}>
            {`Frame ${frameId + 1}`}
          </ListSubheader>
          <Divider />
          {zip([[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], pageRows[frameId]]).map(
            (inst) => {
              return (
                <ListItem key={`Frame${frameId + 1}Inst${inst[0] + 1}`}>
                  <ListItemButton>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={inst[1] ? inst[1].status === "已执行" : false}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={inst[1] === null ? "——" : `${inst[1].address}`}
                      sx={{ fontSize: 6, textAlign: "center" }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            }
          )}
        </List>
      </Demo>
    </Grid>
  ));
}

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export default function MemoryPages(props) {
  return (
    <Box
      container
      sx={{ flexGrow: 1 }}
      alignItems="center"
      justifyContent={"center"}
    >
      <Typography
        component="h1"
        variant="h4"
        color="white"
        gutterBottom
        sx={{ textAlign: "center" }}
      >
        <Button variant="outlined">Memory</Button>
      </Typography>
      <Divider />
      <Box mt={2} mb={2}>
        <Grid container spacing={2}>
          {pages(props.pages)}
        </Grid>
      </Box>
      <Divider />
    </Box>
  );
}
