/** @type {AppTypes.Config} */

/**
 * ELECARE DIRECT S3 CONFIGURATION - FIXED VERSION
 *
 * This configuration eliminates Google Healthcare dependency
 * and uses direct S3 access with custom data source
 */

/** @type {any} */ (window).config = (() => {
    // Safely parse URL parameters with error handling
    let urlParams;
    let fileId = '';
    let studyUID = '';
    let token = '';
    
    try {
        urlParams = new URLSearchParams(window.location.search);
        fileId = urlParams.get('fileId') || '';
        studyUID = urlParams.get('studyUID') || urlParams.get('StudyInstanceUIDs') || '';
        token = urlParams.get('token') || urlParams.get('oauthToken') || '';
        
        console.log('🔍 OHIF Config - Parsed parameters:', {
            fileId: fileId,
            studyUID: studyUID,
            hasToken: !!token,
            tokenLength: token.length
        });
    } catch (error) {
        console.error('❌ OHIF Config - Error parsing URL parameters:', error);
    }

    // Base endpoint for our DICOMweb API (same-origin via reverse proxy)
    const baseDicomweb = 'https://dicom.elecare.ai/dicomweb';

    // Construct the configuration object
    const config = {
        routerBasename: '/',
        // Do not declare extensions here; rely on pluginConfig to avoid duplicates
        extensions: [],
        modes: [
            // Basic viewer mode - this is the correct mode name
            '@ohif/mode-basic-dev-mode'
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
                    // Include WADO-URI only if used by your backend
                    wadoUriRoot: baseDicomweb,

                    // Standard DICOMweb capabilities
                    qidoSupportsIncludeField: true,
                    supportsReject: false,
                    imageRendering: 'wadors',
                    thumbnailRendering: 'wadors',
                    enableStudyLazyLoad: true,
                    supportsFuzzyMatching: false,
                    supportsWildcard: false,

                    // Authentication for Elecare API (passed through proxy if present)
                    requestOptions: {
                        requestFromBrowser: true,
                        headers: token ? {
                            'Authorization': `Bearer ${token}`,
                            'X-File-ID': fileId,
                            'X-Study-UID': studyUID
                        } : {
                            'X-File-ID': fileId,
                            'X-Study-UID': studyUID
                        },
                    },
                    // Also include top-level headers for clients that read from configuration.headers
                    headers: token ? {
                        'Authorization': `Bearer ${token}`,
                        'X-File-ID': fileId,
                        'X-Study-UID': studyUID
                    } : {
                        'X-File-ID': fileId,
                        'X-Study-UID': studyUID
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
    
    // Debug output
    console.log('✅ OHIF Config - Configuration constructed successfully:', {
        dataSources: config.dataSources.length,
        defaultDataSourceName: config.defaultDataSourceName,
        hasToken: !!token
    });
    
    return config;
})();
