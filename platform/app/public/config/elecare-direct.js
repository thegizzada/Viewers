/** @type {AppTypes.Config} */

/**
 * ELECARE UNIVERSAL DICOM CONFIGURATION
 *
 * This configuration works with any OHIF mode and ensures
 * the dicomweb data source is properly configured
 */

/** @type {any} */ (window).config = (() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fileId = urlParams.get('fileId');
    const studyUID = urlParams.get('studyUID') || urlParams.get('StudyInstanceUIDs');
    const token = urlParams.get('token') || urlParams.get('oauthToken');

    console.log('🔧 OHIF Config Loading - Parameters:', { fileId, studyUID, hasToken: !!token });

    // Early-auth: make Authorization available before any network call
    (function enableEarlyAuth() {
        try {
            if (!token) { return; }
            // Provide token to OHIF core fallback
            // Use bracket access to avoid TS lint complaints on Window typing
            window['OHIF'] = window['OHIF'] || {};
            window['OHIF'].user = window['OHIF'].user || {};
            window['OHIF'].user.getAccessToken = function () { return token; };

            // Intercept fetch to attach headers for dicomweb requests
            if (window.fetch && !window['__ohifEarlyAuthFetchPatched']) {
                const origFetch = window.fetch.bind(window);
                window.fetch = function (input, init) {
                    try {
                        const url = typeof input === 'string' ? input : (input && (input['url'] || input.toString())) || '';
                        if (url.indexOf('/dicomweb/') !== -1) {
                            init = init || {};
                            const hdrs = new Headers(init.headers || {});
                            if (!hdrs.has('Authorization')) { hdrs.set('Authorization', 'Bearer ' + token); }
                            if (fileId && !hdrs.has('X-File-ID')) { hdrs.set('X-File-ID', fileId); }
                            if (studyUID && !hdrs.has('X-Study-UID')) { hdrs.set('X-Study-UID', studyUID); }
                            init.headers = hdrs;
                        }
                    } catch (e) { /* no-op */ }
                    return origFetch(input, init);
                };
                window['__ohifEarlyAuthFetchPatched'] = true;
            }

            // Intercept XHR to attach headers for dicomweb requests
            if (!XMLHttpRequest.prototype['__ohifEarlyAuthPatched']) {
                const origOpen = XMLHttpRequest.prototype.open;
                const origSend = XMLHttpRequest.prototype.send;
                XMLHttpRequest.prototype.open = function (method, url) {
                    this['__ohifIsDicom'] = url && url.indexOf('/dicomweb/') !== -1;
                    return origOpen.apply(this, arguments);
                };
                XMLHttpRequest.prototype.send = function (body) {
                    try {
                        if (this['__ohifIsDicom']) {
                            this.setRequestHeader('Authorization', 'Bearer ' + token);
                            if (fileId) { this.setRequestHeader('X-File-ID', fileId); }
                            if (studyUID) { this.setRequestHeader('X-Study-UID', studyUID); }
                        }
                    } catch (e) { /* no-op */ }
                    return origSend.apply(this, arguments);
                };
                XMLHttpRequest.prototype['__ohifEarlyAuthPatched'] = true;
            }

            console.log('[OHIF][AUTH] Early auth enabled');
        } catch (e) {
            console.warn('[OHIF][AUTH] Early auth setup failed', e);
        }
    })();

    // Base endpoint for our DICOMweb API (same-origin via reverse proxy)
    const baseDicomweb = 'https://dicom.elecare.ai/dicomweb';

    const config = {
        routerBasename: '/',
        // Include extensions to ensure they're available
        extensions: [
            '@ohif/extension-default',
            '@ohif/extension-cornerstone'
        ],
        // Include all modes to ensure they're available
        modes: [
            '@ohif/mode-basic-dev-mode',
            '@ohif/mode-longitudinal'
        ],
        customizationService: {
            // Custom branding for Elecare
            brandingLogo: '/assets/elecare-logo.png',
            brandingText: 'Elecare.ai DICOM Viewer',
            theme: {
                primaryColor: 'var(--jmkr-color-1, #007bff)',
                secondaryColor: '#6c757d',
                backgroundColor: '#f8f9fa'
            }
        },
        // Avoid unauthenticated WorkList; go straight to study by UID
        showStudyList: false,
        maxNumberOfWebWorkers: 3,
        showWarningMessageForCrossOrigin: false,
        showCPUFallbackMessage: true,
        showLoadingIndicator: true,
        experimentalStudyBrowserSort: false,
        strictZSpacingForVolumeViewport: true,
        groupEnabledModesFirst: true,
        maxNumRequests: {
            interaction: 100,
            thumbnail: 75,
            prefetch: 25,
        },
        // Use DICOMweb by default so studies auto-load via StudyInstanceUIDs
        defaultDataSourceName: 'dicomweb',
        dataSources: [
            {
                namespace: '@ohif/extension-default.dataSourcesModule.dicomweb',
                sourceName: 'dicomweb',
                configuration: {
                    friendlyName: 'Elecare Same-Origin DICOMweb',
                    name: 'Elecare DICOMweb',
                    // DICOMweb endpoints proxied under same origin
                    qidoRoot: baseDicomweb,
                    wadoRoot: baseDicomweb,
                    wadoRsRoot: baseDicomweb,
                    stowRoot: baseDicomweb,
                    wadoUriRoot: baseDicomweb,

                    // Standard DICOMweb capabilities
                    qidoSupportsIncludeField: true,
                    supportsReject: false,
                    imageRendering: 'wadors',
                    thumbnailRendering: 'wadors',
                    enableStudyLazyLoad: true,
                    supportsFuzzyMatching: false,
                    supportsWildcard: false,

                    // OHIF Documented Authentication Pattern (from their elecare.js example)
                    requestOptions: {
                        requestFromBrowser: true,
                        auth: function() {
                            return token ? `Bearer ${token}` : '';
                        },
                        headers: {
                            'Authorization': token ? `Bearer ${token}` : '',
                            'X-File-ID': fileId || '',
                            'X-Study-UID': studyUID || ''
                        },
                    },
                    // Also include top-level headers (OHIF documented pattern)
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                        'X-File-ID': fileId || '',
                        'X-Study-UID': studyUID || ''
                    },
                },
            },
            {
                namespace: '@ohif/extension-default.dataSourcesModule.dicomfile',
                sourceName: 'dicomfile',
                configuration: {}
            }
        ]
    };

    console.log('✅ OHIF Config Constructed - Base URL:', baseDicomweb, 'Data Sources:', config.dataSources.length);
    return config;
})();
