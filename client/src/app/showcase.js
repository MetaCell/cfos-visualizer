import React, { useEffect, useState } from 'react';
import { getLayoutManagerInstance } from "@metacell/geppetto-meta-client/common/layout/LayoutManager";
import CircularProgress from '@mui/material/CircularProgress';
import {useDispatch, useStore} from 'react-redux';

import {addWidget} from "@metacell/geppetto-meta-client/common/layout/actions";
import {widget1} from "./widgets";
import {makeStyles} from "@mui/styles";

const useStyles = makeStyles({
    layoutContainer: {
        display: 'flex',
        position: 'relative',
        width: '100%',
        height: '100%',
    }
});

/**
 * The component that renders the FlexLayout component of the LayoutManager.
 */
const MainLayout = () => {
    const classes = useStyles();
    const store = useStore();
    const dispatch = useDispatch();
    const [Component, setComponent] = useState(undefined);

  useEffect(() => {
    if (Component === undefined) {
      const myManager = getLayoutManagerInstance();
      if (myManager) {
        setComponent(
          myManager.getComponent()
        );
      }
    }
  }, [store]);

    useEffect(() => {
        dispatch(addWidget(widget1()));
    }, [Component])

  return (
    <div className={classes.layoutContainer}>
      {Component === undefined ? (
        <CircularProgress />
      ) : (
        <Component />
      )}
    </div>
  );
};

export default MainLayout;