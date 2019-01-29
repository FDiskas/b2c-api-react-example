import { WithStyles } from '@material-ui/core';
import { styles } from './styles';
import { IOrderDetailsParsed } from 'src/shared/interfaces/order';

export interface IOrderProductListProps extends WithStyles<typeof styles> {
    items: IOrderDetailsParsed['items'];
}
