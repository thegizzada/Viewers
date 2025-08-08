import {
  CommandsManager,
  ExtensionManager,
  ServicesManager,
  ServiceProvidersManager,
  HotkeysManager,
  UINotificationService,
  UIModalService,
  UIDialogService,
  UIViewportDialogService,
  MeasurementService,
  DisplaySetService,
  ToolbarService,
  ViewportGridService,
  HangingProtocolService,
  CineService,
  UserAuthenticationService,
  errorHandler,
  CustomizationService,
  PanelService,
  WorkflowStepsService,
  StudyPrefetcherService,
  MultiMonitorService,
  // utils,
} from '@ohif/core';

import loadModules, { loadModule as peerImport } from './pluginImports';

/**
 * @param {object|func} appConfigOrFunc - application configuration, or a function that returns application configuration
 * @param {object[]} defaultExtensions - array of extension objects
 */
async function appInit(appConfigOrFunc, defaultExtensions, defaultModes) {
  console.log('[OHIF][INIT] appInit called');
  console.log('[OHIF][INIT] defaultExtensions:', Array.isArray(defaultExtensions) ? defaultExtensions.map(e => e?.id || e) : defaultExtensions);
  console.log('[OHIF][INIT] defaultModes:', Array.isArray(defaultModes) ? defaultModes.map(m => m?.id || m) : defaultModes);
  const commandsManagerConfig = {
    getAppState: () => {},
  };

  const commandsManager = new CommandsManager(commandsManagerConfig);
  const servicesManager = new ServicesManager(commandsManager);
  const serviceProvidersManager = new ServiceProvidersManager();
  const hotkeysManager = new HotkeysManager(commandsManager, servicesManager);

  const appConfig = {
    ...(typeof appConfigOrFunc === 'function'
      ? await appConfigOrFunc({ servicesManager, peerImport })
      : appConfigOrFunc),
  };
  console.log('[OHIF][INIT] appConfig loaded. keys:', Object.keys(appConfig || {}));
  console.log('[OHIF][INIT] appConfig.extensions:', Array.isArray(appConfig.extensions) ? appConfig.extensions.map(e => e?.id || e) : appConfig.extensions);
  console.log('[OHIF][INIT] appConfig.modes:', Array.isArray(appConfig.modes) ? appConfig.modes.map(m => m?.id || m) : appConfig.modes);
  // Default the peer import function
  appConfig.peerImport ||= peerImport;
  appConfig.measurementTrackingMode ||= 'standard';
  console.log('[OHIF][INIT] measurementTrackingMode:', appConfig.measurementTrackingMode);

  const extensionManager = new ExtensionManager({
    commandsManager,
    servicesManager,
    serviceProvidersManager,
    hotkeysManager,
    appConfig,
  });
  console.log('[OHIF][INIT] ExtensionManager created');

  servicesManager.setExtensionManager(extensionManager);
  console.log('[OHIF][INIT] Services registered (pre)');

  servicesManager.registerServices([
    [MultiMonitorService.REGISTRATION, appConfig.multimonitor],
    UINotificationService.REGISTRATION,
    UIModalService.REGISTRATION,
    UIDialogService.REGISTRATION,
    UIViewportDialogService.REGISTRATION,
    MeasurementService.REGISTRATION,
    DisplaySetService.REGISTRATION,
    [CustomizationService.REGISTRATION, appConfig.customizationService],
    ToolbarService.REGISTRATION,
    ViewportGridService.REGISTRATION,
    HangingProtocolService.REGISTRATION,
    CineService.REGISTRATION,
    UserAuthenticationService.REGISTRATION,
    PanelService.REGISTRATION,
    WorkflowStepsService.REGISTRATION,
    [StudyPrefetcherService.REGISTRATION, appConfig.studyPrefetcher],
  ]);
  console.log('[OHIF][INIT] Services registered (post)');

  errorHandler.getHTTPErrorHandler = () => {
    if (typeof appConfig.httpErrorHandler === 'function') {
      return appConfig.httpErrorHandler;
    }
  };

  /**
   * Example: [ext1, ext2, ext3]
   * Example2: [[ext1, config], ext2, [ext3, config]]
   */
  const loadedExtensions = await loadModules([...defaultExtensions, ...appConfig.extensions]);
  console.log('[OHIF][INIT] loadedExtensions:', loadedExtensions.map(e => e?.id));
  await extensionManager.registerExtensions(loadedExtensions, appConfig.dataSources);
  console.log('[OHIF][INIT] registerExtensions complete');

  // TODO: We no longer use `utils.addServer`
  // TODO: We no longer init webWorkers at app level
  // TODO: We no longer init the user Manager

  if (!appConfig.modes) {
    throw new Error('No modes are defined! Check your app-config.js');
  }

  const loadedModes = await loadModules([...(appConfig.modes || []), ...defaultModes]);
  console.log('[OHIF][INIT] loadedModes (raw):', loadedModes.map(m => m?.id || (m && m.modeFactory ? 'factory' : 'unknown')));

  // This is the name for the loaded instance object
  appConfig.loadedModes = [];
  const modesById = new Set();
  for (let i = 0; i < loadedModes.length; i++) {
    let mode = loadedModes[i];
    if (!mode) {
      continue;
    }
    const { id } = mode;
    console.log('[OHIF][INIT] processing mode:', id);

    if (mode.modeFactory) {
      // If the appConfig contains configuration for this mode, use it.
      const modeConfiguration =
        appConfig.modesConfiguration && appConfig.modesConfiguration[id]
          ? appConfig.modesConfiguration[id]
          : {};

      mode = await mode.modeFactory({ modeConfiguration, loadModules });
      console.log('[OHIF][INIT] modeFactory resolved for id:', id, 'resolved.id:', mode?.id);
    }

    if (modesById.has(id)) {
      continue;
    }
    // Prevent duplication
    modesById.add(id);
    if (!mode || typeof mode !== 'object') {
      continue;
    }
    appConfig.loadedModes.push(mode);
  }
  console.log('[OHIF][INIT] appConfig.loadedModes:', appConfig.loadedModes.map(m => m?.id));
  // Hack alert - don't touch the original modes definition,
  // but there are still dependencies on having the appConfig modes defined
  appConfig.modes = appConfig.loadedModes;
  console.log('[OHIF][INIT] appConfig.modes set (final):', appConfig.modes.map(m => m?.id));

  return {
    appConfig,
    commandsManager,
    extensionManager,
    servicesManager,
    serviceProvidersManager,
    hotkeysManager,
  };
}

export default appInit;
