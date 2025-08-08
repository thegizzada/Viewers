/**
 * Entry point for development and production PWA builds.
 */
import 'regenerator-runtime/runtime';
import { createRoot } from 'react-dom/client';
import App from './App';
import React from 'react';

/**
 * EXTENSIONS AND MODES
 * =================
 * pluginImports.js is dynamically generated from extension and mode
 * configuration at build time.
 *
 * pluginImports.js imports all of the modes and extensions and adds them
 * to the window for processing.
 */
import { modes as defaultModes, extensions as defaultExtensions } from './pluginImports';
import loadDynamicConfig from './loadDynamicConfig';
import { publicUrl } from './utils/publicUrl';
export { history } from './utils/history';
export { preserveQueryParameters, preserveQueryStrings } from './utils/preserveQueryParameters';

console.log('[OHIF][BOOT] Starting index.js');
console.log('[OHIF][BOOT] defaultExtensions:', Array.isArray(defaultExtensions) ? defaultExtensions.map(e => e?.id || e)?.slice(0, 50) : defaultExtensions);
console.log('[OHIF][BOOT] defaultModes:', Array.isArray(defaultModes) ? defaultModes.map(m => m?.id || m)?.slice(0, 50) : defaultModes);

loadDynamicConfig(window.config).then(config_json => {
  // Reset Dynamic config if defined
  if (config_json !== null) {
    window.config = config_json;
  }
  window.config.routerBasename ||= publicUrl;

  /**
   * Combine our appConfiguration with installed extensions and modes.
   * In the future appConfiguration may contain modes added at runtime.
   *  */
  console.log('[OHIF][BOOT] Dynamic config loaded?', config_json !== null);
  console.log('[OHIF][BOOT] routerBasename:', window.config.routerBasename);
  const appProps = {
    config: window ? window.config : {},
    defaultExtensions,
    defaultModes,
  };

  const container = document.getElementById('root');

  console.log('[OHIF][BOOT] Rendering App into #root');
  const root = createRoot(container);
  root.render(React.createElement(App, appProps));
});
