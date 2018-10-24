import * as React from 'react';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';

import { SprykerFilterElement } from 'src/shared/components/UI/SprykerFilter';
import { SprykerRange } from 'src/shared/components/UI/SprykerRangeFilter';
import { getCategoriesAction, sendSearchAction } from 'src/shared/actions/Pages/Search';
import {ISearchPageData, RangeFacets, TSpellingSuggestion, ValueFacets} from 'src/shared/interfaces/searchPageData';
import { TAppCurrency } from 'src/shared/reducers/Common/Init';
import { pathProductPageBase, pathSearchPage } from 'src/shared/routes/contentRoutes';

import { AppMain } from '../../Common/AppMain';
import { ProductCard } from '../../Common/ProductCard';

import { connect } from './connect';

import { styles } from './styles';
import {sprykerTheme} from "src/shared/theme/sprykerTheme";
import {IProductLabel} from "src/shared/interfaces/product/index";
import {AppPageTitle} from "src/shared/components/Common/AppPageTitle/index";
type IQuery = {
  q?: string,
  currency: TAppCurrency,
  sort?: string,
  [key: string]: string | number,
};

interface SearchPageProps extends WithStyles<typeof styles>, ISearchPageData {
  isLoading: boolean;
  changeLocation: Function;
}

type RangeType = {min: number, max: number};

interface SearchPageState {
  activeFilters: {[name: string]: string[]};
  activeRangeFilters: {[name: string]: RangeType};
  sort: string;
  selectedCategory: number | string;
  itemsPerPage: number;
}

export const pageTitle = 'Results for ';
export const pageTitleDefault = 'All products';
export const pageIntroText = 'Did you mean ';

export const itemsPerPages: number[] = [12, 24, 36];

@connect
export class SearchPageBase extends React.Component<SearchPageProps, SearchPageState> {
  constructor(props: SearchPageProps) {
    super(props);

    const activeFilters: {[key: string]: string[]} = {};
    const activeRangeFilters: {[key: string]: RangeType} = {};

    props.filters.forEach((filter: ValueFacets) => {
      if (filter.activeValue && filter.activeValue.length) {
        activeFilters[filter.name] = filter.activeValue;
      }
    });

    props.rangeFilters.forEach((filter: RangeFacets) => {
      if (filter.activeMin && filter.activeMax) {
        activeRangeFilters[filter.name] = {min: filter.activeMin, max: filter.activeMax};
      }
    });

    this.state = {
      activeFilters,
      activeRangeFilters,
      sort: props.currentSort,
      selectedCategory: 0,
      itemsPerPage: props.pagination.currentItemsPerPage,
    };
  }

  public componentDidMount() {
    this.props.dispatch(getCategoriesAction());
  }

  public updateActiveFilters = (name: string, values: Array<string>) => {
    this.setState((prevState: SearchPageState) => ({activeFilters: {...prevState.activeFilters, [name]: values}}));
  };

  public updateRangeFilters = (name: string, {min, max}: RangeType) => {
    this.setState((prevState: SearchPageState) => ({
      activeRangeFilters: {
        ...prevState.activeRangeFilters,
        [name]: {min, max},
      },
    }));
  };

  public updateSearch = (e: any) => {
    e.preventDefault();
    e.stopPropagation();

    const query: IQuery = {
      q: this.props.searchTerm,
      currency: this.props.currency,
      sort: this.state.sort,
      include: '',
      ipp: this.state.itemsPerPage,
      ...this.state.activeFilters,
    };

    if (this.state.selectedCategory) {
      query.category = this.state.selectedCategory;
    }

    Object.keys(this.state.activeRangeFilters).forEach((key: string) => {
      query[`${key.includes('price') ? 'price' : key}[min]`] = this.state.activeRangeFilters[key].min;
      query[`${key.includes('price') ? 'price' : key}[max]`] = this.state.activeRangeFilters[key].max;
    });

    this.props.dispatch(sendSearchAction(query));
  };

  public handleSetSorting = (e: any) => {
    this.setState({sort: e.target.value});
  };

  public handleSetItemsPerPage = (e: any) => {
    this.setState({itemsPerPage: e.target.value});
  };

  public handlePagination = (e: any, value: number | string) => {
    const query: IQuery = {
      q: this.props.searchTerm,
      currency: this.props.currency,
      sort: this.state.sort,
      include: '',
      ipp: this.state.itemsPerPage,
      page: value,
      ...this.state.activeFilters,
    };

    if (value === 'prev') {
      query.page = this.props.pagination.currentPage - 1;
    }

    if (value === 'next') {
      query.page = this.props.pagination.currentPage + 1;
    }

    if (this.state.selectedCategory) {
      query.category = this.state.selectedCategory;
    }

    Object.keys(this.state.activeRangeFilters).forEach((key: string) => {
      query[`${key.includes('price') ? 'price' : key}[min]`] = this.state.activeRangeFilters[key].min;
      query[`${key.includes('price') ? 'price' : key}[max]`] = this.state.activeRangeFilters[key].max;
    });

    this.props.dispatch(sendSearchAction(query));
  };

  public renderProduct = (sku: string, name: string) => {
    this.props.changeLocation(`${pathProductPageBase}/${sku}`);
  };

  public selectCategory = (categoryId: string | number) => (e: any) => {
    this.setState({selectedCategory: categoryId});

    const query: IQuery = {
      q: this.props.searchTerm,
      currency: this.props.currency,
      sort: this.state.sort,
      include: '',
      ipp: this.state.itemsPerPage,
      category: categoryId,
      ...this.state.activeFilters,
    };


    Object.keys(this.state.activeRangeFilters).forEach((key: string) => {
      query[`${key.includes('price') ? 'price' : key}[min]`] = this.state.activeRangeFilters[key].min;
      query[`${key.includes('price') ? 'price' : key}[max]`] = this.state.activeRangeFilters[key].max;
    });

    this.props.dispatch(sendSearchAction(query));

    this.props.changeLocation(`${pathSearchPage}/${categoryId}`);
  };

  public render() {
    const {
      classes,
      items,
      searchTerm,
      currency,
      filters,
      rangeFilters,
      isLoading,
      sortParams,
      pagination,
      category,
      spellingSuggestion,
    } = this.props;

    const renderFilters: any[] = [];

    if (filters && filters.length) {
      filters.forEach((filter: any) => {
        if (Array.isArray(filter.values) && filter.values.length) {
          renderFilters.push(
            <Grid item xs={ 3 } key={ filter.name }>
              <SprykerFilterElement
                attributeName={ filter.name }
                menuItems={ filter.values }
                activeValues={ this.state.activeFilters[filter.name] || [] }
                handleChange={ this.updateActiveFilters }
              />
            </Grid>,
          );
        }
      });
    }

    const renderRangeFilters: any[] = rangeFilters && rangeFilters.length
      ? rangeFilters.map((filter: any) => (
        <Grid item xs={ 4 } key={ filter.name }>
          <SprykerRange
            attributeName={ filter.name }
            min={ filter.min / 100 } max={ filter.max / 100 }
            currentValue={ this.state.activeRangeFilters[filter.name] || {
              min: filter.min / 100,
              max: filter.max / 100,
            } }
            handleChange={ this.updateRangeFilters }
          />
        </Grid>
      ))
      : null;

    const pages: any[] = [];

    if (+pagination.currentPage > 1) {
      pages.push(
        <BottomNavigationAction
          showLabel
          icon={ <ChevronLeft/> }
          value="prev"
          key="prev"
          className={ classes.pageNumber }
        />,
      );
    }

    const start = pagination.currentPage <= 5 ? 1 : pagination.currentPage - 4;
    const end = pagination.maxPage > 5
      ? pagination.currentPage <= 5 ? 5 : pagination.currentPage
      : pagination.maxPage;

    for (let i = start; i <= end; i++) {
      pages.push(
        <BottomNavigationAction
          showLabel
          label={ i }
          value={ i }
          key={ `page-${i}` }
          className={ classes.pageNumber }
        />);
    }

    if (+pagination.currentPage < pagination.maxPage) {
      pages.push(
        <BottomNavigationAction
          showLabel
          icon={ <ChevronRight/> }
          value="next"
          key="next"
          className={ classes.pageNumber }
        />,
      );
    }

    const categoryList = category.map((category) => {
      // const pureListItem = (data: any) => (
      //   <ListItem
      //     button
      //     key={ `category-${data.nodeId}` }
      //     onClick={ this.selectCategory(data.nodeId) }
      //     selected={ this.state.selectedCategory === data.nodeId }
      //   >
      //     <ListItemText primary={ data.name }/>
      //   </ListItem>
      // );
      //
      // const nestedList = (data: any) => (
      //   <li key={ `category-${data.nodeId}` }>
      //     <ListItem button onClick={ this.selectCategory(data.nodeId) }
      //               selected={ this.state.selectedCategory === data.nodeId }>
      //       <ListItemText primary={ data.name }/>
      //     </ListItem>
      //     <List dense className={ classes.nestedList }>
      //       {
      //         data.children.map((child: any) => {
      //           return Array.isArray(child.children) && child.children.length
      //             ? nestedList(child)
      //             : pureListItem(child);
      //         })
      //       }
      //     </List>
      //   </li>
      // );

      let name: string;

      const searchName = (leaf: any) => {
        if (leaf.nodeId === category.value) {
          name = leaf.name;
          return true;
        }

        if (Array.isArray(leaf.children) && leaf.children.length) {
          return leaf.children.some((child: any) => searchName(child));
        }

        return false;
      };

      this.props.categoriesTree.some(searchName);

      if (!name) {
        return null;
      }

      return (
          <ListItem
            button
            key={ `category-${category.value}` }
            onClick={ this.selectCategory(category.value) }
            selected={ this.state.selectedCategory === category.value }
          >
            <ListItemText primary={ `${name} (${category.doc_count})` }/>
          </ListItem>
      );

      // return Array.isArray(category.children) && category.children.length
      //   ? nestedList(category)
      //   : pureListItem(category);
    });

    // TODO: Get label programmatically
    const label: IProductLabel = {
      type: 'sale',
      text: 'Sale',
    };

    const PageIntroComponent = ({className, suggestion}: {className: string, suggestion: string | null}) => {
      if(!suggestion) {
        return null;
      }
      return (
        <React.Fragment>
          {pageIntroText}
          <span className={className}>{suggestion}</span> ?
        </React.Fragment>
      );
    };

    return (
      <AppMain>
        <AppPageTitle
          title={searchTerm ? `${pageTitle} "${searchTerm}"` :  pageTitleDefault}
          intro={<PageIntroComponent className={classes.spellingSuggestion} suggestion={spellingSuggestion} />}
        />

        <Grid container>
          <Grid item xs={ 3 }>
            <List
              component="nav"
              subheader={ <ListSubheader component="div">Categories</ListSubheader> }
              className={ classes.categoryList }
            >
              { categoryList }
            </List>
          </Grid>
          <Grid item xs={ 9 } container>
            { renderFilters }

            <Grid item xs={ 12 } container>
              { renderRangeFilters }
            </Grid>

            <Grid item xs={ 12 } container className={ classes.buttonsRow }>
              <Grid
                item
                xs={ 3 }
              >
                <Button variant="contained" color="primary" onClick={ this.updateSearch }>
                  Filter
                </Button>
              </Grid>
              <Grid
                item
                xs={ 6 }
              >
                <FormControl>
                  <Select
                    value={ this.state.itemsPerPage }
                    onChange={ this.handleSetItemsPerPage }
                    name="pages"
                  >
                    {
                      itemsPerPages.map((qty: number) => (
                        <MenuItem value={ qty } key={ `pages-${qty}` }>
                          { qty }
                        </MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
                <FormControl className={ classes.formControl }>
                  <Select
                    value={ this.state.sort }
                    onChange={ this.handleSetSorting }
                    name="sort"
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Sorting...
                    </MenuItem>
                    {
                      sortParams && sortParams.map((param) => <MenuItem value={ param }
                                                                        key={ `sort-${param}` }>{ param }</MenuItem>)
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={ 3 }>
                <Button variant="contained" color="primary" onClick={ this.updateSearch }>
                  Sort
                </Button>
              </Grid>
            </Grid>
            <Grid
              item
              xs={ 12 }
              container
              spacing={ sprykerTheme.appFixedDimensions.gridSpacing }
            >
              {
                items && items.length > 0
                  ? items.map((item: any) => (
                    <Grid item xs={ 12 } sm={ 6 } md={ 4 }
                          key={ item.abstract_sku || item.abstractSku }
                    >
                      <ProductCard
                        currency={ currency }
                        images={ item.images }
                        price={ item.price }
                        prices={ item.prices }
                        name={ item.abstract_name || item.abstractName }
                        sku={ item.abstract_sku || item.abstractSku }
                        onSelectProduct={ this.renderProduct }
                        label={label}
                      />
                    </Grid>
                  ))
                  : <Paper elevation={ 1 } className={ classes.empty } id="emptyResult">
                    <Typography variant="headline" component="h3">
                      Nothing to show.
                    </Typography>
                    <Typography component="p">
                      { isLoading ? 'Waiting results' : 'Try another search' }
                    </Typography>
                  </Paper>
              }
            </Grid>
            <Grid item xs={ 12 } container justify="center" alignItems="center">
              <BottomNavigation
                value={ pagination.currentPage }
                onChange={ this.handlePagination }
                className={ classes.pagesContainer }
              >
                { pages }
              </BottomNavigation>
            </Grid>
          </Grid>
        </Grid>
      </AppMain>
    );
  }
}

export const SearchPage = withStyles(styles)(SearchPageBase);

export default SearchPage;
