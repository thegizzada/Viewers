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
        showStudyList: true,
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