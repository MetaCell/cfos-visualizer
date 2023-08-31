import { Box, Button } from "@mui/material";
import LOGO from '../logo.png';
import vars from "../theme/variables"
import Menu from '@metacell/geppetto-meta-ui/menu/Menu';
import { toolbarMenu } from "../components/configuration/Toolbar/toolbarMenuConfiguration";
import { ArticleIcon, DropdownIcon } from '../icons'

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

export const Header = () =>
{
  return (
    <Box sx={classes.root}>
      <img src={ LOGO } alt="Logo" />

      <Box pl={ 1.5 } lineHeight={ 1 } borderLeft={ `1px solid ${ headerBorderLeftColor }` }>
        <Menu
          configuration={toolbarMenu}
          menuHandler={() => {}}
        />
        {/* <Button disableRipple sx={classes.button}>
          <ArticleIcon />
          Effect of psilocybin on c-Fos-IF in distinct contexts
          <DropdownIcon />
        </Button> */}
      </Box>
    </Box>
  )
};