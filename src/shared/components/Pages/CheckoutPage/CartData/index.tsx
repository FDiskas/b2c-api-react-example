import * as React from 'react';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { styles } from './styles';
import {CartProductsList} from "src/shared/components/Pages/CheckoutPage/CartProductsList/index";


interface CartDataProps extends WithStyles<typeof styles> {

}


export const CartDataBase: React.SFC<CartDataProps> = (props): JSX.Element => {
  const {classes}  = props;

  return (
    <Grid container className={ classes.root }>
      <Grid item xs={ 12 }>
        CartData
        <CartProductsList />
      </Grid>
    </Grid>
  );
};

export const CartData = withStyles(styles)(CartDataBase);

