import {Stack} from "@mui/material";
import React from "react";
import Detail from "./Detail";
import {Publications} from "./Publications";
import details from "../../data/details.json";

export const Details = () => {
  const renderComponent = (key, value) => {
    if (typeof value === 'string') {
      return <Detail title={key} text={value} />;
    } else if (typeof value === 'object') {
      return <Publications title={key} value={value} /> ;
    } else {
      return null;
    }
  };
  
  const renderDetails = () => {
    return Object.entries(details).map(([key, value]) => (
      <React.Fragment key={key}>
        {renderComponent(key, value)}
      </React.Fragment>
    ));
  };
  return <Stack spacing='1.5rem'>
    {renderDetails()}
  </Stack>
}