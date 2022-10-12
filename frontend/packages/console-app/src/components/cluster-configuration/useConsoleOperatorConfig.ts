import { getGroupVersionKindForModel } from '@console/dynamic-plugin-sdk/src/lib-core';
import { useK8sWatchResource } from '@console/dynamic-plugin-sdk/src/utils/k8s/hooks/useK8sWatchResource';
import { ConsoleOperatorConfigModel } from '@console/internal/models';
import { K8sResourceKind } from '@console/internal/module/k8s';
import { CONSOLE_OPERATOR_CONFIG_NAME } from '@console/shared/src';

const useConsoleOperatorConfig = <R extends K8sResourceKind>() =>
  useK8sWatchResource<R>({
    groupVersionKind: getGroupVersionKindForModel(ConsoleOperatorConfigModel),
    isList: false,
    name: CONSOLE_OPERATOR_CONFIG_NAME,
  });

export default useConsoleOperatorConfig;
