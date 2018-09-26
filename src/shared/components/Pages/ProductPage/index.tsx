import * as React from "react";
import {RouteProps} from "react-router";
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {reduxify} from '../../../lib/redux-helper';

import {ProductState} from '../../../reducers/Pages/Product';
import {AppMain} from '../../Common/AppMain';
import {ImageSlider} from '../../Common/ImageSlider';
import {ProductGeneralInfo} from './ProductGeneralInfo';
import {DropdownControlled, defaultItemValue} from '../../UI/DropdownControlled';
import {getFormattedPrice} from '../../../services/productHelper';
import {ProductAvailability} from './ProductAvailability';
import {SprykerButton} from '../../UI/SprykerButton';
import {ProductAttributes} from './ProductAttributes';
import {
  IProductAttributeMap,
  IProductAttributes,
  IProductCardImages,
  IProductPropFullData,
  ISuperAttributes,
} from '../../../interfaces/product';
import {IImageSlide} from '../../../components/Common/ImageSlider';

import {styles} from './styles';
import {ISuperAttribute} from "../../../services/productHelper/superAttributes";
import {getAvailabilityDisplay} from "../../../services/productHelper/availability";

export const buyBtnTitle = "Add to cart";

interface ProductPageProps extends WithStyles<typeof styles>, RouteProps {
  product: any;
  isLoading: boolean;
  currency: string;
}


interface ProductPageState extends IProductPropFullData, ISuperAttributes {
  attributeMap: IProductAttributeMap | null;
  superAttrSelected: IProductAttributes;
  // currentProductType: TCurrentProductType;
}

export class ProductPageBase extends React.Component<ProductPageProps, ProductPageState> {

  public state: ProductPageState = {
    attributeMap: null,
    superAttrSelected: {},
    superAttributes: null,
    // currentProductType: null,
    productType: null,
    sku: null,
    name: null,
    images: null,
    availability: null,
    description: null,
    price: null,
    attributes: null,
    quantity: null,
  };

  public componentDidMount = () => {
    if (this.props.product) {
      this.setInitialData();
    }
  }

  public componentDidUpdate = (prevProps: any, prevState: any) => {
    if (this.props.product && !prevState.productType) {
      this.setInitialData();
    }
  }

  public dropdownHandleChange = (event: any, child: React.ReactNode): void => {
    const key = event.target.name;
    const value = event.target.value;

    let productData: IProductPropFullData | null;

    if (value === defaultItemValue) {
      // If selected nothing
      productData = this.getProductDataObject(
        this.props.product.abstractProduct
      );
    } else {
      // If selected a concrete product
      const idProductConcrete = this.getIdProductConcrete(key, value);

      if (!idProductConcrete) {
        // Such product does not exist
        productData = this.getProductDataObject(null);
      } else {
        // Such product exists
        productData = this.getProductDataObject(
          this.props.product.concreteProducts[idProductConcrete]
        );
      }
    }

    this.setState( (prevState: ProductPageState) => {
      if (this.state.superAttrSelected[key] === value) {
        return;
      }
      return (
        {
          ...prevState,
          superAttrSelected: {
            ...prevState.superAttrSelected,
            [key]: value,
          },
          ...productData,
        }
      );
    });
  }

  public buyBtnHandler = (event: any): void => {
    console.log('buyBtnHandler clicked');
  }

  private getProductDataObject = (data: IProductPropFullData | null): IProductPropFullData => {
    const defaultValues = this.props.product.abstractProduct;
    return {
      sku: data ? data.sku : null,
      name: data ? data.name : defaultValues.name,
      images: data ? data.images : defaultValues.images,
      availability: data ? data.availability : getAvailabilityDisplay(false),
      description: data ? data.description : defaultValues.description,
      price: data ? data.price : null,
      attributes: data ? data.attributes : defaultValues.attributes,
      quantity: data ? data.quantity : null,
      productType: data ? data.productType : 'absentProduct',
    };
  }

  private setInitialData = (): void => {

    const productData = this.getProductDataObject(this.props.product.abstractProduct);

    // Parsing superAttributes to set initial data for this.state.superAttrSelected
    const selectedAttrNames = this.getInitialSuperAttrSelected();

    this.setState( (prevState: ProductPageState) => {
      return (
        {
          ...prevState,
          superAttributes: this.props.product.superAttributes,
          attributeMap: this.props.product.attributeMap,
          superAttrSelected: selectedAttrNames,
          ...productData,
        }
      );
    });
  }

  private getInitialSuperAttrSelected = (): any => {
    const attributes = this.props.product.superAttributes;
    if (!attributes.length) {
      return null;
    }
    const superAttrSelected: object = {};

    const selectedAttrNames = attributes
      .map((attr: ISuperAttribute) => (attr.name))
      .reduce((acc: any, name: string) => {
        acc[name] = null;
        return acc;
      }, superAttrSelected);

    return selectedAttrNames;
  }

  private findIdProductConcreteByPath = (path: Array<string>): string => {
    const variants = {...this.state.attributeMap.attribute_variants};
    const id = path.reduce((acc: any, key: string) => {
      if (acc[key] && acc[key].id_product_concrete) {
        return acc[key].id_product_concrete;
      }
      return acc[key];
    }, variants);

    return id;
  }

  // Created path from object of superAttrSelected
  private createPathToIdProductConcrete = (selected: IProductAttributes) => {
    let path: Array<string> = [];
    let isAllSuperAttrSelected: boolean = true;

    // Create path to id_product_concrete if all fields in superAttrSelected is NOT empty
    for (let prop in selected) {
      if (!selected[prop] || selected[prop] === defaultItemValue) {
        isAllSuperAttrSelected = false;
        continue;
      }
      path.push(`${prop}:${selected[prop]}`);
    }

    if (!isAllSuperAttrSelected) {
      return false;
    }

    return path;
  }

  private getIdProductConcrete = (key: string, value: string) => {
    const selected = {...this.state.superAttrSelected};
    selected[key] = value;
    const path = this.createPathToIdProductConcrete(selected);
    if (!path) {
      return false;
    }

    const id = this.findIdProductConcreteByPath(path);
    return id;
  }

  private getSuperAttrValue = (key: string) => {
    if (!key) {
      return defaultItemValue;
    }
    return (
      this.state.superAttrSelected[key]
        ? this.state.superAttrSelected[key]
        : defaultItemValue
    );
  }

  private getImageData = (images: Array<IProductCardImages>): Array<IImageSlide> => {
    const response = images.map((element: any, index: number) => (
      {
        id: index,
        src: element.externalUrlLarge,
      }
    ));
    return response;
  }

  public render(): JSX.Element {
    console.info('props: ', this.props);
    if (!this.props.product || !this.state.productType) {
      return null;
    }
    const {
      classes,
      isLoading,
      currency,
      product,

    } = this.props;
    console.info('state: ', this.state);

    return (
      <AppMain isLoading={isLoading}>
        <div className={classes.root} >
          <Grid container justify="center" >
            <Grid item xs={12} sm={6} className={classes.sliderParent}>
              <ImageSlider images={this.getImageData(this.state.images)} />
            </Grid>
            <Grid item xs={12} sm={6} >
              <ProductGeneralInfo
                name={this.state.name}
                sku={this.state.sku}
                price={getFormattedPrice(this.state.price, currency)}
              />

              { this.state.superAttributes
                ? this.state.superAttributes.map((item: ISuperAttribute) => (
                  <DropdownControlled
                    key={item.name}
                    nameAttr={item.name}
                    nameToShow={item.nameToShow}
                    value={this.getSuperAttrValue(item.name)}
                    handleChange={this.dropdownHandleChange}
                    menuItems={item.data}
                  />
                ))
                : null
              }

              <ProductAvailability availability={this.state.availability} />
              <SprykerButton title={buyBtnTitle} extraClasses={classes.buyBtn} onClick={this.buyBtnHandler}/>
            </Grid>
          </Grid>
          <Grid container justify="center" >
            <ProductAttributes attributes={this.state.attributes} />
            <Grid item xs={12}>
              <Typography color="inherit" variant="body2" component="p" gutterBottom={true}>
                {this.state.description}
              </Typography>
            </Grid>
          </Grid>
        </div>
      </AppMain>
    );
  }
}

export const ProductPage = withStyles(styles)(ProductPageBase);

export const ConnectedProductPage = reduxify(
  (state: any, ownProps: any) => {
    const routerProps: RouteProps = state.routing ? state.routing : {};
    const productProps: ProductState = state.pageProduct ? state.pageProduct : null;
    return (
      {
        location: routerProps.location ? routerProps.location : ownProps.location,
        isLoading: productProps && productProps.pending ? productProps.pending : ownProps.pending,
        product: productProps && productProps.data
          ? productProps.data.selectedProduct
          : ownProps.selectedProduct,
        currency: productProps && productProps.data.currency ? productProps.data.currency : ownProps.currency,
      }
    );
  }
)(ProductPage);
