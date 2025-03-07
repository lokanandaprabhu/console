import * as React from 'react';
import {
  FilterSidePanel,
  FilterSidePanelCategory,
  FilterSidePanelCategoryItem,
} from '@patternfly/react-catalog-view-extension';
import * as _ from 'lodash';
import { CatalogItemAttribute } from '@console/dynamic-plugin-sdk';
import { FieldLevelHelp } from '@console/internal/components/utils';
import {
  CatalogFilter,
  CatalogFilterCounts,
  CatalogFilterItem,
  CatalogFilters,
} from '../utils/types';

type CatalogFiltersProps = {
  activeFilters: CatalogFilters;
  filterGroupCounts: CatalogFilterCounts;
  filterGroupMap: { [key: string]: CatalogItemAttribute };
  filterGroupsShowAll: { [key: string]: boolean };
  catalogItemsCount: number;
  onFilterChange: (filterType: string, id: string, value: boolean) => void;
  onShowAllToggle: (groupName: string) => void;
};

const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  activeFilters,
  filterGroupCounts,
  filterGroupMap,
  filterGroupsShowAll,
  catalogItemsCount,
  onFilterChange,
  onShowAllToggle,
}) => {
  const sortedActiveFilters = Object.keys(activeFilters)
    .sort()
    .reduce<CatalogFilters>((acc, groupName) => {
      acc[groupName] = activeFilters[groupName];
      return acc;
    }, {});

  const getFilterGroup = (filterGroup: CatalogFilter, groupName: string): CatalogFilter => {
    const filterGroupKeys = Object.keys(filterGroup);

    return filterGroupKeys.length > 0
      ? _.omitBy(filterGroup, (filter, filterName) => {
          const { label, active } = filter;
          const count = filterGroupCounts[groupName]?.[filterName] ?? 0;
          const showFilter = label && (active || (count > 0 && catalogItemsCount !== count));
          return !showFilter;
        })
      : {};
  };

  const renderFilterItem = (filter: CatalogFilterItem, filterName: string, groupName: string) => {
    const { label, active } = filter;
    const count = filterGroupCounts[groupName]?.[filterName] ?? 0;
    // TODO remove when adopting https://github.com/patternfly/patternfly-react/issues/5139
    const dummyProps = {} as any;
    return (
      <FilterSidePanelCategoryItem
        key={filterName}
        count={count}
        checked={active}
        onClick={(e: React.ChangeEvent<HTMLInputElement>) =>
          onFilterChange(groupName, filterName, e.target.checked)
        }
        data-test={`${groupName}-${_.kebabCase(filterName)}`}
        {...dummyProps}
      >
        {label}
      </FilterSidePanelCategoryItem>
    );
  };

  const renderFilterGroup = (filterGroup: CatalogFilter, groupName: string) => {
    const fg = getFilterGroup(filterGroup, groupName);
    const filterGroupKeys = Object.keys(fg);
    if (filterGroupKeys.length > 0) {
      const sortedFilterGroup = filterGroupKeys.sort().reduce<CatalogFilter>((acc, filterName) => {
        acc[filterName] = filterGroup[filterName];
        return acc;
      }, {});
      return (
        <FilterSidePanelCategory
          key={groupName}
          title={
            <>
              {filterGroupMap[groupName].label || groupName}
              {filterGroupMap[groupName].description && (
                <FieldLevelHelp>{filterGroupMap[groupName].description}</FieldLevelHelp>
              )}
            </>
          }
          onShowAllToggle={() => onShowAllToggle(groupName)}
          showAll={filterGroupsShowAll[groupName] ?? false}
          data-test-group-name={groupName}
        >
          {_.map(sortedFilterGroup, (filter, filterName) =>
            renderFilterItem(filter, filterName, groupName),
          )}
        </FilterSidePanelCategory>
      );
    }
    return null;
  };

  return (
    <FilterSidePanel>
      {_.map(sortedActiveFilters, (filterGroup, groupName) =>
        renderFilterGroup(filterGroup, groupName),
      )}
    </FilterSidePanel>
  );
};

export default CatalogFilters;
