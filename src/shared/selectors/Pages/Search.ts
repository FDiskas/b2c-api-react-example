import { createSelector } from 'reselect';

const searchedItemsSelector = (state: any) => state.pageSearch.items;

export const filterItems = (condition: any) => {
  const filteredSelector = createSelector(
    searchedItemsSelector,
    (items) => items.filter((item: any) => item.value === condition)
)
};
