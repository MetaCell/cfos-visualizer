import * as THREE from "three";
import * as AMI from 'ami.js';

import React, { useEffect, useRef, useState } from "react";
import { Badge, Box, Button, Chip, Divider, FormControlLabel, FormGroup, Popover, Switch, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import * as viewerHelper from '../helpers/viewerHelper';
import { STACK_HELPER_BORDER_COLOR } from "../settings";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import vars from "../theme/variables";

const { primaryActiveColor, headerBorderColor, headerBg, headerButtonColor, headerBorderLeftColor, headingColor } = vars;

const StackHelper = AMI.stackHelperFactory( THREE );


export const Viewer = ( props ) =>
{
	const [ anchorEl, setAnchorEl ] = React.useState( null );

	const [ filterApplied, setFilterApplied ] = useState( true );

	const handleClick = ( event ) =>
	{
		setAnchorEl( event.currentTarget );
	};

	const handleClose = () =>
	{
		setAnchorEl( null );
	};

	const open = Boolean( anchorEl );
	const id = open ? 'simple-popover' : undefined;
	const atlas = useSelector( state => state.viewer.atlas );
	const activityMaps = useSelector( state => state.viewer.activityMaps );

	const containerRef = useRef( null );
	const rendererRef = useRef( null );
	const sceneRef = useRef( null );
	const cameraRef = useRef( null );
	const contronsRef = useRef( null );

	const atlasRefs = useRef( null );

	// On Mount
	useEffect( () =>
	{
		initViewer();
		animate();
		subscribeEvents();
		return () =>
		{
			unSubscribeEvents();
		};
	}, [] );

	const initViewer = () =>
	{
		rendererRef.current = viewerHelper.initRenderer( containerRef );
		sceneRef.current = viewerHelper.initScene();
		cameraRef.current = viewerHelper.getOrthographicCamera( containerRef );
		sceneRef.current.add( cameraRef.current );
		contronsRef.current = viewerHelper.getControls( cameraRef.current, containerRef.current );
		cameraRef.current.controls = contronsRef.current;
	};

	const animate = () =>
	{
		contronsRef.current.update();
		rendererRef.current.render( sceneRef.current, cameraRef.current );

		requestAnimationFrame( function ()
		{
			animate();
		} );
	};

	const subscribeEvents = () =>
	{
		containerRef.current.addEventListener( 'wheel', handleScroll );
	};

	const unSubscribeEvents = () =>
	{
		containerRef.current.removeEventListener( 'wheel', handleScroll );
	};

	const handleScroll = ( event ) =>
	{
		// todo:
	};

	// On atlas changes
	useEffect( () =>
	{
		if ( atlas )
		{
			const stackHelper = new StackHelper( atlas.stack );
			stackHelper.bbox.visible = false;
			stackHelper.border.color = STACK_HELPER_BORDER_COLOR;
			stackHelper.index = Math.floor( stackHelper.stack._frame.length / 2 );

			sceneRef.current.add( stackHelper );
			viewerHelper.updateCamera( containerRef.current, cameraRef.current, stackHelper );

			stackHelper.orientation = cameraRef.current.stackOrientation;

			atlasRefs.current = {
				...atlasRefs.current,
				stackHelper
			};
		}


	}, [ atlas ] );

	const isActive = filterApplied ? primaryActiveColor : headerBorderColor;
	return (
		<Box sx={ { position: "relative", height: "100%", width: "100%" } }>
			<Badge badgeContent={ 4 } color="primary">
				<Button sx={ {
					'&.MuiButton-root': {
						position: 'absolute',
						right: '0.75rem',
						height: '2.25rem',
						borderRadius: '0.5rem',
						border: `0.0625rem solid ${ isActive }`,
						fontSize: '0.875rem',
						fontWeight: 600,
						textTransform: 'none',
						background: headerBg,
						boxShadow: '0rem 0.0625rem 0.125rem 0rem rgba(16, 24, 40, 0.05)',
						top: '0.75rem',
						zIndex: 9,
						gap: '0.5rem',
						'&:hover': {
							background: headerBorderColor
						}
					}
				} } aria-describedby={ id } variant="contained" onClick={ handleClick }>
					Statistical maps
					<KeyboardArrowDownIcon sx={ { fontSize: '1.25rem', color: headerButtonColor } } />
				</Button>
			</Badge>

			<Popover
				id={ id }
				sx={{maxHeight: '20rem'}}
				open={ open }
				anchorEl={ anchorEl }
				onClose={ handleClose }
				anchorOrigin={ {
					vertical: 'bottom',
					horizontal: 'right',
				} }
				transformOrigin={ {
					vertical: 'top',
					horizontal: 'right',
				} }
			>
				<Box p={ 2 }>
					{Array(3).fill(undefined).map((item, index) => (
						<Box>
							{index !== 0 && <Divider sx={{ mt: 1.5, mb: 1, background: headerBorderLeftColor }} />}
							<Box sx={ {
								height: '1.875rem',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								position: 'sticky',
								background: headerBorderColor,
								zIndex: 9,
								top: 0,
								'& .MuiTypography-root': {
									fontSize: '0.75rem',
									fontWeight: 400,
									lineHeight: '150%',
									color: headingColor
								}
							}}>
								<Typography>
									Effect of psilocybin on c-Fos-IF in distinct contexts
								</Typography>

								{index === 0 && <Chip label="Current Experiment" />}
							</Box>
							<FormGroup>
								{ Array( 10 ).fill( { label: 'c-Fos__avg__saline.nii.gz' } ).map( ( item, index ) => (
									<Box sx={ {
										position: 'relative',
										paddingLeft: '0.25rem',

										'&:hover': {
											'&:before': {
												background: primaryActiveColor,
											}
										},

										'&:before': {
											content: '""',
											height: '100%',
											width: '0.0625rem',
											background: headerBorderColor,
											position: 'absolute',
											left: 0,
											top: 0,
										},
									} }>
										<FormControlLabel key={ index } control={ <Switch /> } labelPlacement="start" label={ item.label } />
									</Box>
								) ) }
							</FormGroup>
						</Box>
					))}
				</Box>
			</Popover>
			<Box sx={ { position: "absolute", top: 0, left: 0, height: "100%", width: "100%", } } ref={ containerRef }>
				{/* <Typography> Viewer </Typography> */ }
			</Box>
		</Box>
	);
};