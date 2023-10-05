import React, { useEffect, useState } from 'react';
import { getLayoutManagerInstance } from "@metacell/geppetto-meta-client/common/layout/LayoutManager";
import CircularProgress from '@mui/material/CircularProgress';
import {useDispatch, useStore} from 'react-redux';

import {addWidget} from "@metacell/geppetto-meta-client/common/layout/actions";
import {widget1} from "../layout/widgets";
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
    const [LayoutComponent, setLayoutComponent] = useState(undefined);

  useEffect(() => {
    if (LayoutComponent === undefined) {
      const myManager = getLayoutManagerInstance();
      if (myManager) {
        setLayoutComponent(
          myManager.getComponent()
        );
      }
    }
  }, [store]);

    useEffect(() => {
        dispatch(addWidget(widget1()));
    }, [LayoutComponent])

  return (
    <div className={classes.layoutContainer}>
      {LayoutComponent === undefined ? (
        <CircularProgress />
      ) : (
        <LayoutComponent />
      )}
    </div>
  );
};

export default MainLayout;