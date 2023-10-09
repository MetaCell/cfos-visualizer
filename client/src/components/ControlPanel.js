import { Box, Typography } from "@mui/material";
import React from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import vars from "../theme/variables";
import CustomSlider from "./Slider";
import Table from "./Table";

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

const experiments = [
	{
			name: 'c-Fos__avg__saline.nii.gz',
			description: 'from external experiment - Comparative Analysis of Mouse Brain c-Fos-IF Expression under LSD and DMT'
	},
	{
			name: 'c-Fos__avg__saline.nii.gz',
			description: 'from external experiment - Comparative Analysis of Mouse Brain c-Fos-IF Expression under LSD and DMT'
	},
	{
			name: 'c-Fos__avg__saline.nii.gz',
			description: 'from external experiment - Comparative Analysis of Mouse Brain c-Fos-IF Expression under LSD and DMT'
	},
	{
			name: 'c-Fos__avg__saline.nii.gz',
			description: 'from external experiment - Comparative Analysis of Mouse Brain c-Fos-IF Expression under LSD and DMT'
	},
]

const ControlPanel = () =>
{
	const [ open, setOpen ] = React.useState( true );
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
						tableContent={experiments}
					/>
				</Box>
			</Box>
		</>
	);
};

export default ControlPanel;