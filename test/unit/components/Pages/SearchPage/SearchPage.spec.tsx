import * as React from 'react';
import { HTMLAttributes, shallow, ShallowWrapper, mount } from "enzyme";

import {
  SearchPage,
  SearchPageBase,
  ConnectedSearchPage,
  pageTitle
} from '../../../../../src/shared/components/Pages/SearchPage';
import {fixtureSearchTerm, fixtureItems} from '../../../../../src/shared/components/Pages/SearchPage/fixture';
import {ProductCard} from '../../../../../src/shared/components/Common/ProductCard';
import {styles} from '../../../../../src/shared/components/Pages/SearchPage/styles';

// Required props
const items = fixtureItems;
const searchTerm = fixtureSearchTerm;
const currency = 'EUR';

const dispatch = () => null;

const countItems = fixtureItems.length;
// Common html block parent
const parent = '.component-container';

const getShallowedComponent = () => (
  shallow(
    <SearchPageBase
      items={items}
      searchTerm={searchTerm}
      currency={currency}
      classes={styles}
    />
  )
);

describe('components->Pages->SearchPage', () => {
  let wrapper;

  beforeEach(() => {
    wrapper =  getShallowedComponent();
  });


  it("renders the base component", () => {
    expect(wrapper.find(parent)).toHaveLength(1);
  });

  it("renders the ProductCards", () => {
    expect(wrapper.find(ProductCard)).toHaveLength(countItems);
  });

  it("renders the pageTitle", () => {
    expect(wrapper.find('#pageTitle')).toHaveLength(1);
    expect(wrapper.find('#pageTitle').dive().dive().text()).toContain(pageTitle);
  });

  it("renders the searchTerm", () => {
    expect(wrapper.find('#searchTerm')).toHaveLength(1);
    expect(wrapper.find('#searchTerm').dive().dive().text()).toContain(searchTerm);
  });

  it("renders the box when the items is null", () => {
    wrapper.setProps({ items: null });
    expect(wrapper.find('#emptyResult')).toHaveLength(1);
  });

});
