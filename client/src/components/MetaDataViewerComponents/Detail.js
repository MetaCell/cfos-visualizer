import {Stack, Typography} from "@mui/material";
import React from "react";
import variables from "../../theme/variables";

const { gray25, gray200} = variables

const Detail = ({title, text}) => <Stack spacing='.25rem'>
  <Typography variant='h4' fontWeight={400} color={gray25}>{title}</Typography>
  <Typography variant='h4' fontWeight={400} color={gray200}>{text}</Typography>
</Stack>

export default Detail