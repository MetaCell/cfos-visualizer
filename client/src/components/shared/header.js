import {Box, Typography} from "@mui/material";
import Menu from '@metacell/geppetto-meta-ui/menu/Menu';
import {useDispatch, useSelector} from "react-redux";
import LOGO from '../../logo.png';
import vars from "../../theme/variables"
import {ArticleIcon, DropdownIcon} from "../../icons";
import {generateToolbarItems, toolbarMenu} from "../../helpers/toolbarMenuConfiguration";
import {actions} from "../../redux/constants";
import {fetchAndSetExperimentAndAtlas} from "../../redux/actions";

const { headerBg, headerButtonColor, headerBorderColor, headerBorderLeftColor } = vars;

const classes = {
  root: {
    height: '2.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: headerBg,
    padding: '0 0.75rem',
    borderBottom: `0.0625rem solid ${headerBorderColor}`
  },

  button: {
    padding: 0,
    minWidth: 1,
    gap: '0.5rem',
    fontWeight: 600,
    color: headerButtonColor,
    textTransform: 'none',

    '&:hover': {
      background: 'transparent'
    }
  }
}

export const Header = () => {
  const dispatch = useDispatch();
  const experimentsAtlas = useSelector(state => state.model.ExperimentsAtlas);
  const currentExperiment = useSelector(state => state.currentExperiment);
  const currentAtlas = useSelector(state => state.viewer.atlas);
  const atlasesMetadata = useSelector( state => state.model.Atlases)

  const dynamicToolbarMenu = {
    global: toolbarMenu.global,
    itemOptions: toolbarMenu.itemOptions,
    buttons: [{
      label: (
          <Box component='span' display='flex' alignItems='center'>
            <Typography sx={{ fontSize: '0.875rem', marginRight: '0.5rem', fontWeight: 600, color: '#D6D5D7', lineHeight: '142.857%' }}>
              {currentExperiment?.id}
            </Typography>
            <DropdownIcon />
          </Box>
      ),
      icon: <Box display='flex' mr='0.5rem'><ArticleIcon /></Box>,
      action: {},
      position: "bottom-start",
      list: generateToolbarItems(experimentsAtlas, currentExperiment, currentAtlas, atlasesMetadata)
    }]
  };

  const menuHandler = (event) => {
    if(event.handlerAction === actions.FETCH_AND_SET_CURRENT_EXPERIMENT_AND_ATLAS){
      const [experimentID, atlasID] = event.parameters
      dispatch(fetchAndSetExperimentAndAtlas(experimentID, atlasID))
    }
  }

  return (
    <Box sx={classes.root}>
      <img src={ LOGO } alt="Logo" />

      <Box pl={ 1.5 } lineHeight={ 1 } borderLeft={ `1px solid ${ headerBorderLeftColor }` }>
        <Menu
          configuration={dynamicToolbarMenu}
          menuHandler={menuHandler}
        />
      </Box>
    </Box>
  )
};