import * as React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import { SuperAttributeBlock } from './SuperAttributeBlock';
import { ProductSuperAttributeProps as Props, ProductSuperAttributeState as State } from './types';
import { styles } from './styles';

export class ProductSuperAttributeComponent extends React.PureComponent<Props, State> {
  public state: State = {
    selectedValues: null,
  };

  private onChange = ({name, value}: {name: string, value: string}) => {
    const {selectedValues} = this.state;
    const updatedValues = selectedValues === null
      ? {[name]: value}
      : {
        ...selectedValues,
        [name]: value,
      };

    this.props.onChange({name, value});
    this.setState(() => ({selectedValues: updatedValues}));
  };

  public render() {
    const {productData} = this.props;

    return (
      <div>
        { productData.map(attribute => (
          <SuperAttributeBlock attributeData={ attribute } onValueChanged={ this.onChange } key={ attribute.name } />
        )) }
      </div>
    );
  }
}

export const ProductSuperAttribute = withStyles(styles)(ProductSuperAttributeComponent);
