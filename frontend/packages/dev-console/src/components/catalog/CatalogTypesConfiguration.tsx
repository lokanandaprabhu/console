import * as React from 'react';
import { Alert, DualListSelector } from '@patternfly/react-core';
import { useTranslation } from 'react-i18next';
import { CatalogItemType, isCatalogItemType } from '@console/dynamic-plugin-sdk/src/extensions';
import { useResolvedExtensions } from '@console/dynamic-plugin-sdk/src/lib-core';
import { k8sPatchResource } from '@console/dynamic-plugin-sdk/src/utils/k8s/k8s-resource';
import { ConsoleOperatorConfigModel } from '@console/internal/models';
import { K8sResourceKind } from '@console/internal/module/k8s';
import { useDebounceCallback } from '@console/shared/src';
import useConsoleOperatorConfig from '../../../../console-app/src/components/cluster-configuration/useConsoleOperatorConfig';

type Types = {
  state: 'Enabled' | 'Disabled';
  enabled?: string[];
  disabled?: string[];
};

type DeveloperCatalogConsoleConfig = K8sResourceKind & {
  spec: {
    customization?: {
      developerCatalog?: {
        types?: Types;
      };
    };
  };
};

type SaveStatus =
  | { status: 'pending' }
  | { status: 'in-progress' }
  | { status: 'successful' }
  | { status: 'error'; error: any };

const CatalogTypesConfiguration: React.FC = () => {
  const { t } = useTranslation();

  const [enabledOptions, setEnabledOptions] = React.useState<React.ReactNode[]>([]);
  const [disabledOptions, setDisabledOptions] = React.useState<React.ReactNode[]>([]);
  const [saveStatus, setSaveStatus] = React.useState<SaveStatus>();
  const [consoleConfig, consoleConfigLoaded, consoleConfigError] = useConsoleOperatorConfig<
    DeveloperCatalogConsoleConfig
  >();
  const [catalogTypesExtensions, catalogTypesExtensionsLoaded] = useResolvedExtensions<
    CatalogItemType
  >(isCatalogItemType);

  const developerCatalogTypesState =
    consoleConfig?.spec?.customization?.developerCatalog?.types?.state;
  const developerCatalogEnabledList =
    consoleConfig?.spec?.customization?.developerCatalog?.types?.enabled;
  const developerCatalogDisabledList =
    consoleConfig?.spec?.customization?.developerCatalog?.types?.disabled;

  React.useEffect(() => {
    let disabledSubCatalogs = [];
    let enabledSubCatalogs = [];

    if (developerCatalogTypesState && developerCatalogTypesState === 'Disabled') {
      if (developerCatalogDisabledList && developerCatalogDisabledList.length > 0) {
        disabledSubCatalogs = catalogTypesExtensions.filter((val) =>
          developerCatalogDisabledList.includes(val.properties.type),
        );
        enabledSubCatalogs = catalogTypesExtensions.filter(
          (val) => !developerCatalogDisabledList.includes(val.properties.type),
        );
      } else {
        disabledSubCatalogs = catalogTypesExtensions;
      }
    } else if (
      developerCatalogTypesState &&
      developerCatalogTypesState === 'Enabled' &&
      developerCatalogEnabledList &&
      developerCatalogEnabledList.length > 0
    ) {
      disabledSubCatalogs = catalogTypesExtensions.filter(
        (val) => !developerCatalogEnabledList.includes(val.properties.type),
      );
      enabledSubCatalogs = catalogTypesExtensions.filter((val) =>
        developerCatalogEnabledList.includes(val.properties.type),
      );
    } else {
      enabledSubCatalogs = catalogTypesExtensions;
    }

    if (catalogTypesExtensionsLoaded) {
      setEnabledOptions(
        enabledSubCatalogs.map((type) => (
          <div itemID={type.properties.type}>{type.properties.title}</div>
        )),
      );
      setDisabledOptions(
        disabledSubCatalogs.map(
          (type) =>
            type.properties.title && (
              <div itemID={type.properties.type}>{type.properties.title}</div>
            ),
        ),
      );
    }
  }, [
    catalogTypesExtensions,
    catalogTypesExtensionsLoaded,
    developerCatalogDisabledList,
    developerCatalogEnabledList,
    developerCatalogTypesState,
  ]);

  const save = useDebounceCallback((enabledTypes: string[], disabledTypes: string[]) => {
    setSaveStatus({ status: 'in-progress' });

    let replacePayload = {};

    if (enabledTypes.length === 0) {
      replacePayload = { state: 'Disabled' };
    } else if (disabledTypes.length === 0) {
      replacePayload = { state: 'Enabled' };
    } else if (developerCatalogTypesState && developerCatalogTypesState === 'Enabled') {
      replacePayload = { state: 'Enabled', enabled: enabledTypes };
    } else {
      replacePayload = { state: 'Disabled', disabled: disabledTypes };
    }

    const addPayload = {
      developerCatalog: {
        types: replacePayload,
      },
    };

    let path = '';
    let operation = '';
    let payload = {};
    if (
      consoleConfig?.spec?.customization?.developerCatalog &&
      Object.keys(consoleConfig?.spec?.customization?.developerCatalog).length > 0
    ) {
      path = '/spec/customization/developerCatalog/types';
      operation = 'replace';
      payload = replacePayload;
    } else {
      path = '/spec/customization';
      operation = 'add';
      payload = addPayload;
    }

    k8sPatchResource({
      model: ConsoleOperatorConfigModel,
      resource: consoleConfig,
      data: [
        {
          op: operation,
          path,
          value: payload,
        },
      ],
    })
      .then(() => setSaveStatus({ status: 'successful' }))
      .catch((error) => setSaveStatus({ status: 'error', error }));
  }, 2000);

  const onListChange = (
    newAvailableOptions: React.ReactElement<any>[],
    newChosenOptions: React.ReactElement<any>[],
  ) => {
    setEnabledOptions(newAvailableOptions);
    setDisabledOptions(newChosenOptions);
    save(
      newAvailableOptions.map((node) => node.props.itemID),
      newChosenOptions.map((node) => node.props.itemID),
    );
  };

  return (
    <>
      <DualListSelector
        availableOptionsTitle={t('devconsole~Enabled Catalog types')}
        chosenOptionsTitle={t('devconsole~Disabled Catalog types')}
        isSearchable
        availableOptions={enabledOptions}
        chosenOptions={disabledOptions}
        onListChange={onListChange}
        isDisabled={!consoleConfigLoaded || consoleConfigError}
      />
      {consoleConfigError ? (
        <Alert variant="warning" isInline title={t('console-app~Could not load configuration.')} />
      ) : null}
      {saveStatus?.status === 'successful' ? (
        <Alert variant="success" isInline title={t('console-app~Saved.')}>
          {t(
            'console-app~This config update requires a console rollout, this can take up to a minute and require a browser refresh.',
          )}
        </Alert>
      ) : null}
      {saveStatus?.status === 'error' ? (
        <Alert variant="danger" isInline title={t('console-app~Could not save configuration.')} />
      ) : null}
    </>
  );
};

export default CatalogTypesConfiguration;
