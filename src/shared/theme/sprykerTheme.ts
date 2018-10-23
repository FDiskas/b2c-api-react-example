import {createSprykerTheme} from "./index";
import {appContainerStyles} from "./properties/new/appContainerStyles";
import {appPalette} from "./properties/overwritten/appPalette";
import {appTypographyStyles} from "./properties/overwritten/appTypography";
import {appFixedDimensions} from "./properties/new/appFixedDimensions";
import {appColors} from "./properties/new/appColors";

export const sprykerTheme = createSprykerTheme({
  // New
  appContainerStyles,
  appFixedDimensions,
  appColors,

  // Overwritten
  palette: appPalette,
  typography: appTypographyStyles,
});
