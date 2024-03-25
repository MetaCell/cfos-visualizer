import React, { useEffect, useRef, useState } from 'react';
import { Box, Badge, Button } from '@mui/material';
import ViewerToolbar from './ViewerToolbar';
import StatisticalMapsPopover from './StatisticalMapsPopover';
import { useSelector, useDispatch } from 'react-redux';
import { KeyboardArrowDownIcon, KeyboardArrowUpIcon, HomeIcon, ZoomInIcon, ZoomOutIcon, TonalityIcon, AutoModeIcon } from '../../icons';
import { Experiment } from './types';

export const Viewer: React.FC = () => {
  const [wireframeMode, setWireframeMode] = React.useState(false);
  const [sliceIndex, setSliceIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isOpen = Boolean(anchorEl);
  const currentAtlasStackHelperRef = useRef<any>(null);
  const [experiments, setExperiments] = useState<Experiment[]>([
    // Populate this based on your application's state or props
  ]);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    //setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handlePreviousSlice = () => {
    if (sliceIndex && sliceIndex > 0) {
        setSliceIndex(sliceIndex - 1);
    }
  };

    const handleNextSlice = () => {
        const currentAtlas = currentAtlasStackHelperRef.current;
        if (sliceIndex && currentAtlas && sliceIndex < currentAtlas.orientationMaxIndex - 1) {
            setSliceIndex(sliceIndex + 1)
        }
    };

    const handleCenterStack = () => {
        const currentAtlas = currentAtlasStackHelperRef.current;
        if (currentAtlas) {
            const centerIndex = Math.floor(currentAtlas.stack._frame.length / 2);
            setSliceIndex(centerIndex);
        }
    };

    const handleActivityMapChange = (experimentName: string, mapName: string, checked: boolean) => {
        // Logic to update the state based on switch change
        // This might involve setting which activity maps are active or visible
      };

  const toolbarOptions = [
    {
        title: "Previous slice",
        Icon: <KeyboardArrowUpIcon />,
        onClickFunc: handlePreviousSlice,
        isVisible: true
    },
    {
        title: "Center stack",
        Icon: <HomeIcon />,
        onClickFunc: handleCenterStack,
        isVisible: true
    },
    {
        title: "Next slice",
        Icon: <KeyboardArrowDownIcon />,
        onClickFunc: handleNextSlice,
        isVisible: true
    },
    // {
    //     title: "Auto scroll through slices",
    //     Icon: <AutoModeIcon />,
    //     onClickFunc: () => console.log("Auto scroll through slices"),
    //     isVisible: true
    // },
    // {
    //     title: "Zoom in",
    //     Icon: <ZoomInIcon />,
    //     onClickFunc: () => console.log("Zoom in"),
    //     isVisible: true
    // },
    // {
    //     title: "Zoom out",
    //     Icon: <ZoomOutIcon />,
    //     onClickFunc: () => console.log("Zoom out"),
    //     isVisible: true
    // },
    {
        title: "Switch to wireframe",
        Icon: <TonalityIcon />,
        onClickFunc: () => setWireframeMode(prevMode => !prevMode),
        isVisible: true
    }
]

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      <ViewerToolbar options={toolbarOptions} />
      <Button onClick={handlePopoverOpen}>
        Show Maps <KeyboardArrowDownIcon />
      </Button>
      <StatisticalMapsPopover
        id="statistical-maps-popover"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        experiments={experiments}
        onActivityMapChange={handleActivityMapChange}
      />
      <Box ref={containerRef} sx={{ height: '100%', width: '100%' }}>
      </Box>
    </Box>
  );
};