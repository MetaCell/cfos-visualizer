import { Box, Typography } from "@mui/material";
import React from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import vars from "../theme/variables";
import CustomSlider from "./Slider";
import Table from "./Table";
import {useSelector} from "react-redux";
import {messages} from "../redux/constants";

const { headerBorderLeftColor, headingColor, accordianTextColor } = vars;

const styles = {
	controlPanel: {
		borderRadius: '0.5rem 0.5rem 0 0',
		border: '0.0625rem solid rgba(48, 47, 49, 0.60)',
		background: 'linear-gradient(0deg, rgba(30, 30, 31, 0.60) 0%, rgba(30, 30, 31, 0.60) 100%), #0F0F10'
	},
	controlPanelHeader: {
		height: '2.75rem',
		pl: 1.5,
		pr: 3,
		display: 'flex',
		userSelect: 'none',
		alignItems: 'center',
		borderBottom: '0.0625rem solid transparent'
	},

	controlPanelBody: {
		px: 1.5,
		overflow: 'auto',
		transition: 'all 0.3s ease-in-out',
	},

	controlPanelHeaderHeading: {
		color: headingColor,
		fontSize: '0.875rem',
		fontWeight: 400,
		lineHeight: '142.857%',
	},

	controlPanelHeaderSubHeading: {
		color: accordianTextColor,
		marginLeft: 1,
		fontSize: '0.75rem',
		fontWeight: 400,
		lineHeight: '150%',
	},

	transition: {
		transition: 'all ease-in-out .3s'
	},

	pointer: {
		cursor: 'pointer'
	},
};



const ControlPanel = () =>
{
	const [ open, setOpen ] = React.useState( true );
	const activeAtlas = useSelector(state => state.viewer.atlas);
	const activeActivityMaps = useSelector(state => state.viewer.activityMaps);

	const atlasesMetadata = useSelector(state => state.model.Atlases);
	const activityMapsMetadata = useSelector(state => state.model.ActivityMaps);

	const getViewerObjectsData = () => {
		const viewerObjects = []

		if (activeAtlas) {
			for (const activityMapId of Object.keys(activeActivityMaps)) {
				const activityMapMetadata = activityMapsMetadata[activityMapId];
				const activityMap = activeActivityMaps[activityMapId];

				viewerObjects.push({
					id: activityMapId,
					name: activityMapMetadata.name,
					description: activityMapMetadata.description || messages.NO_DESCRIPTION,
					color: activityMap.color
				});
			}

			// Atlas should be the last entry in the array
			const atlasId = activeAtlas.id;
			const atlasMetadata = atlasesMetadata[atlasId];

			viewerObjects.push({
				id: atlasId,
				name: atlasMetadata.name,
				description: atlasMetadata.description || messages.NO_DESCRIPTION
			});
		}
		return viewerObjects
	}

	const viewerObjects = getViewerObjectsData()

	return (
		<>
			<Box sx={ styles.controlPanel }>
				<Box sx={ {
					...styles.controlPanelHeader,
					borderBottomColor: `${ open ? headerBorderLeftColor : 'transparent' }`,
				} }>
					<Box
						display='flex'
						alignItems='center'
						gap='0.25rem'
						height={1}
						flex={1}
						onClick={() => setOpen( !open )}
						sx={styles.pointer}
					>
						<ExpandMoreIcon sx={ {
							...styles.transition,
							transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
						}} />
						<Typography sx={styles.controlPanelHeaderHeading}>
							Control panel
							<Typography sx={ styles.controlPanelHeaderSubHeading } component='span'>
								3 active statistical maps
							</Typography>
						</Typography>
					</Box>

					<CustomSlider defaultValue={0} width='30%' heading="Global intensity" />
				</Box>

				<Box
					sx={{
					...styles.controlPanelBody,
					maxHeight: !open ? 0 : 300,
					}}
				>
					<Table
						tableHeader={ [ 'Actions', 'Name', 'Configure intensity' ] }
						tableContent={viewerObjects}
					/>
				</Box>
			</Box>
		</>
	);
};

export default ControlPanel;