/** @type {AppTypes.Config} */

/**
 * ELECARE DIRECT S3 CONFIGURATION
 *
 * This configuration eliminates Google Healthcare dependency
 * and uses direct S3 access with custom data source
 */

window.config = (() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fileId = urlParams.get('fileId');
    const studyUID = urlParams.get('studyUID') || urlParams.get('StudyInstanceUIDs');
    const token = urlParams.get('token') || urlParams.get('oauthToken');

    // Base endpoint for our DICOMweb API
    const baseUrl = 'https://ec2.jamaker.com';

    return {
        routerBasename: '/',
        extensions: [
            // Enable measurement tracking
            '@ohif/extension-measurement-tracking',
            // Enable cornerstone for DICOM rendering
            '@ohif/extension-cornerstone',
            // Enable default tools
            '@ohif/extension-default'
        ],
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
        // Prefer local file ingestion by default; DICOMweb remains available for metadata
        defaultDataSourceName: 'dicomfile',
        dataSources: [
            {
                namespace: '@ohif/extension-default.dataSourcesModule.dicomweb',
                sourceName: 'dicomweb',
                configuration: {
                    friendlyName: 'Elecare Direct S3 DICOM Server',
                    name: 'Elecare S3',
                    // DICOMweb endpoints for our custom server
                    wadoUriRoot: `${baseUrl}/api/dicom/wado`,
                    qidoRoot: `${baseUrl}/api/dicom/qido`,
                    wadoRsRoot: `${baseUrl}/api/dicom/wado`,
                    // Some OHIF paths check wadoRoot specifically
                    wadoRoot: `${baseUrl}/api/dicom/wado`,

                    // Standard DICOMweb capabilities
                    qidoSupportsIncludeField: true,
                    supportsReject: false,
                    imageRendering: 'wadors',
                    thumbnailRendering: 'wadors',
                    enableStudyLazyLoad: true,
                    supportsFuzzyMatching: false,
                    supportsWildcard: false,

                    // Authentication for Elecare API
                    requestOptions: {
                        requestFromBrowser: true,
                        headers: {
                            'Authorization': token ? `Bearer ${token}` : '',
                            'X-File-ID': fileId || '',
                            'X-Study-UID': studyUID || ''
                        },
                    },
                    // Also include top-level headers for clients that read from configuration.headers
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
})();
