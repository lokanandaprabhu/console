/* eslint-disable */
import * as React from 'react';
import {
  HorizontalNavProps,
  UseResolvedExtensions,
  VirtualizedTableFC,
  TableDataProps,
  UseActiveColumns,
  ListPageHeaderProps,
  ListPageCreateProps,
  ListPageCreateLinkProps,
  ListPageCreateButtonProps,
  ListPageCreateDropdownProps,
  ListPageFilterProps,
  UseListPageFilter,
  ResourceLinkProps,
  OverviewProps,
  OverviewGridProps,
  InventoryItemTitleProps,
  InventoryItemBodyProps,
  InventoryItemStatusProps,
  ResourceYAMLEditorProps,
  ResourceEventStreamProps,
} from '../extensions/console-types';
import { StatusPopupSectionProps, StatusPopupItemProps } from '../extensions/dashboard-types';

export * from '../app/components';
export * from './common-types';

export const useResolvedExtensions: UseResolvedExtensions = require('@console/dynamic-plugin-sdk/src/api/useResolvedExtensions')
  .useResolvedExtensions;

/**
 * A component that creates a Navigation bar. It takes array of NavPage objects and renderes a NavBar.
 * Routing is handled as part of the component.
 * @example
 * ```ts
 * const HomePage: React.FC = (props) => {
 *     const page = {
 *       href: '/home',
 *       name: 'Home',
 *       component: () => <>Home</>
 *     }
 *     return <HorizontalNav match={props.match} pages={[page]} />
 * }
 * ```
 *
 * @param {object=} resource - The resource associated with this Navigation, an object of K8sResourceCommon type
 * @param {NavPage[]} pages - An array of page objects
 * @param {object} match - match object provided by React Router
 */
export const HorizontalNav: React.FC<HorizontalNavProps> = require('@console/internal/components/utils/horizontal-nav')
  .HorizontalNavFacade;
export const VirtualizedTable: VirtualizedTableFC = require('@console/internal/components/factory/Table/VirtualizedTable')
  .default;
export const TableData: React.FC<TableDataProps> = require('@console/internal/components/factory/Table/VirtualizedTable')
  .TableData;
export const useActiveColumns: UseActiveColumns = require('@console/internal/components/factory/Table/active-columns-hook')
  .useActiveColumns;
export const ListPageHeader: React.FC<ListPageHeaderProps> = require('@console/internal/components/factory/ListPage/ListPageHeader')
  .default;
export const ListPageCreate: React.FC<ListPageCreateProps> = require('@console/internal/components/factory/ListPage/ListPageCreate')
  .default;
export const ListPageCreateLink: React.FC<ListPageCreateLinkProps> = require('@console/internal/components/factory/ListPage/ListPageCreate')
  .ListPageCreateLink;
export const ListPageCreateButton: React.FC<ListPageCreateButtonProps> = require('@console/internal/components/factory/ListPage/ListPageCreate')
  .ListPageCreateButton;
export const ListPageCreateDropdown: React.FC<ListPageCreateDropdownProps> = require('@console/internal/components/factory/ListPage/ListPageCreate')
  .ListPageCreateDropdown;
export const ListPageFilter: React.FC<ListPageFilterProps> = require('@console/internal/components/factory/ListPage/ListPageFilter')
  .default;
export const useListPageFilter: UseListPageFilter = require('@console/internal/components/factory/ListPage/filter-hook')
  .useListPageFilter;
export const ResourceLink: React.FC<ResourceLinkProps> = require('@console/internal/components/utils/resource-link')
  .ResourceLink;
export { default as ResourceStatus } from '../app/components/utils/resource-status';

export { checkAccess, useAccessReview, useAccessReviewAllowed } from '../app/components/utils/rbac';

export {
  useK8sModel,
  useK8sModels,
  useK8sWatchResource,
  useK8sWatchResources,
} from '../utils/k8s/hooks';

export { consoleFetch, consoleFetchJSON, consoleFetchText } from '../utils/fetch';

// Expose K8s CRUD utilities as below
export {
  k8sGetResource as k8sGet,
  k8sCreateResource as k8sCreate,
  k8sUpdateResource as k8sUpdate,
  k8sPatchResource as k8sPatch,
  k8sDeleteResource as k8sDelete,
  k8sListResource as k8sList,
  k8sListResourceItems as k8sListItems,
} from '../utils/k8s';
export {
  getAPIVersionForModel,
  getGroupVersionKindForResource,
  getGroupVersionKindForModel,
} from '../utils/k8s/k8s-ref';

export const StatusPopupSection: React.FC<StatusPopupSectionProps> = require('@console/shared/src/components/dashboard/status-card/StatusPopup')
  .StatusPopupSection;
export const StatusPopupItem: React.FC<StatusPopupItemProps> = require('@console/shared/src/components/dashboard/status-card/StatusPopup')
  .default;
export const Overview: React.FC<OverviewProps> = require('@console/shared/src/components/dashboard/Dashboard')
  .default;
export const OverviewGrid: React.FC<OverviewGridProps> = require('@console/shared/src/components/dashboard/DashboardGrid')
  .default;
export const InventoryItem: React.FC = require('@console/shared/src/components/dashboard/inventory-card/InventoryCard')
  .default;
export const InventoryItemTitle: React.FC<InventoryItemTitleProps> = require('@console/shared/src/components/dashboard/inventory-card/InventoryCard')
  .InventoryItemTitle;
export const InventoryItemBody: React.FC<InventoryItemBodyProps> = require('@console/shared/src/components/dashboard/inventory-card/InventoryCard')
  .InventoryItemBody;
export const InventoryItemStatus: React.FC<InventoryItemStatusProps> = require('@console/shared/src/components/dashboard/inventory-card/InventoryCard')
  .InventoryItemStatus;
export const InventoryItemLoading: React.FC = require('@console/shared/src/components/dashboard/inventory-card/InventoryCard')
  .InventoryItemLoading;

export { useFlag } from '../utils/flags';

/**
 * A lazy loaded YAML editor for Kubernetes resources with hover help and completion.
 * The editor will handle updating the resource when the user clicks save unless an onSave handler is provided.
 * It should be wrapped in a React.Suspense component.
 * @example
 * ```tsx
 * <React.Suspense fallback={<LoadingBox />}>
 *   <ResourceYAMLEditor
 *     initialResource={resource}
 *     header="Create resource"
 *     onSave={(content) => updateResource(content)}
 *   />
 * </React.Suspense>
 * ```
 * @param {ResourceYAMLEditorProps['initialResource']} initialResource - YAML/Object representing a resource to be shown by the editor.
 * This prop is used only during the inital render
 * @param {ResourceYAMLEditorProps['header']} header - Add a header on top of the YAML editor
 * @param {ResourceYAMLEditorProps['onSave']} onSave - Callback for the Save button.
 * Passing it will override the default update performed on the resource by the editor
 */
export const ResourceYAMLEditor: React.FC<ResourceYAMLEditorProps> = require('@console/internal/components/AsyncResourceYAMLEditor')
  .AsyncResourceYAMLEditor;

/**
 * A component to show events related to a particular resource.
 *
 * @example
 * ```tsx
 * const [resource, loaded, loadError] = useK8sWatchResource(clusterResource);
 * return <ResourceEventStream resource={resource} />
 * ```
 * @param {ResourceEventStreamProps['resource']} - An object whose related events should be shown.
 */
export const ResourceEventStream: React.FC<ResourceEventStreamProps> = require('@console/internal/components/events')
  .WrappedResourceEventStream;
