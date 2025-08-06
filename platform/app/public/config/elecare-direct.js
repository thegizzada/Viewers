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
    const studyUID = urlParams.get('studyUID');
    const token = urlParams.get('token') || urlParams.get('oauthToken');

    // Direct S3 access endpoint
    const s3Endpoint = 'https://jamaker.s3.amazonaws.com';
    const elecareApiEndpoint = 'https://ec2.jamaker.com/api/dicom';

    return {
        routerBasename: '/',
        extensions: [
            // Enable measurement tracking
            '@ohif/extension-measurement-tracking',
            // Enable cornerstone for DICOM rendering
            '@ohif/extension-cornerstone',
            // Add custom Elecare extension (to be developed)
            // '@elecare/extension-patient-integration'
        ],
        modes: [
            // Basic viewer mode
            '@ohif/mode-basic-dev-mode',
            // Measurement tracking mode
            '@ohif/mode-measurement-tracking'
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
        defaultDataSourceName: 'elecare-direct',
        dataSources: [
            {
                namespace: '@elecare/extension-direct-s3.dataSourcesModule.directS3',
                sourceName: 'elecare-direct',
                configuration: {
                    friendlyName: 'Elecare Direct S3 DICOM Server',
                    name: 'Elecare S3',
                    // Custom endpoints for direct S3 access
                    wadoUriRoot: `${elecareApiEndpoint}/wado`,
                    qidoRoot: `${elecareApiEndpoint}/qido`,
                    wadoRoot: `${elecareApiEndpoint}/wado`,

                    // Enhanced capabilities
                    qidoSupportsIncludeField: true,
                    supportsReject: false, // S3 doesn't support rejection
                    imageRendering: 'wadors',
                    thumbnailRendering: 'wadors',
                    enableStudyLazyLoad: true,
                    supportsFuzzyMatching: false, // Direct file access
                    supportsWildcard: false,
                    omitQuotationForMultipartRequest: true,

                    // Direct file access configuration
                    directFileAccess: {
                        enabled: true,
                        fileId: fileId,
                        studyInstanceUID: studyUID,
                        s3Endpoint: s3Endpoint
                    },

                    // Authentication for Elecare API
                    requestOptions: {
                        auth: function () {
                            return `Bearer ${token}`;
                        },
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'X-File-ID': fileId,
                            'X-Study-UID': studyUID
                        },
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'X-File-ID': fileId,
                        'X-Study-UID': studyUID
                    },
                },
            },

            // Fallback to Google Healthcare (if needed)
            {
                namespace: '@ohif/extension-default.dataSourcesModule.dicomweb',
                sourceName: 'google-healthcare-fallback',
                configuration: {
                    friendlyName: 'Google Healthcare (Fallback)',
                    name: 'GCP-Fallback',
                    wadoUriRoot: 'https://healthcare.googleapis.com/v1/projects/wise-analyst-427921-k5/locations/us-central1/datasets/elecareai/dicomStores/elecareai-dicom-store/dicomWeb',
                    qidoRoot: 'https://healthcare.googleapis.com/v1/projects/wise-analyst-427921-k5/locations/us-central1/datasets/elecareai/dicomStores/elecareai-dicom-store/dicomWeb',
                    wadoRoot: 'https://healthcare.googleapis.com/v1/projects/wise-analyst-427921-k5/locations/us-central1/datasets/elecareai/dicomStores/elecareai-dicom-store/dicomWeb',
                    qidoSupportsIncludeField: true,
                    supportsReject: true,
                    imageRendering: 'wadors',
                    thumbnailRendering: 'wadors',
                    enableStudyLazyLoad: true,
                    supportsFuzzyMatching: true,
                    supportsWildcard: true,
                    omitQuotationForMultipartRequest: true,
                    requestOptions: {
                        auth: function () {
                            return `Bearer ${token}`;
                        },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            }
        ],

        // Enhanced error handling
        errorHandling: {
            onAuthFailure: () => {
                console.warn('OHIF: Authentication failed, requesting token refresh');
                parent.postMessage({
                    type: 'OHIF_AUTH_FAILURE',
                    fileId: fileId
                }, '*');
            },
            onLoadFailure: (error) => {
                console.error('OHIF: Failed to load study', error);
                parent.postMessage({
                    type: 'OHIF_LOAD_FAILURE',
                    error: error.message,
                    fileId: fileId
                }, '*');
            }
        },

        // Performance monitoring
        performanceTracking: {
            enabled: true,
            metrics: ['loadTime', 'renderTime', 'interactionDelay'],
            onMetric: (metric) => {
                parent.postMessage({
                    type: 'OHIF_PERFORMANCE_METRIC',
                    metric: metric
                }, '*');
            }
        },

        // Integration callbacks
        callbacks: {
            onMeasurementComplete: (measurement) => {
                parent.postMessage({
                    type: 'OHIF_MEASUREMENT_COMPLETE',
                    measurement: measurement,
                    fileId: fileId,
                    studyUID: studyUID
                }, '*');
            },
            onAnnotationCreate: (annotation) => {
                parent.postMessage({
                    type: 'OHIF_ANNOTATION_CREATE',
                    annotation: annotation,
                    fileId: fileId
                }, '*');
            }
        }
    };
})();
