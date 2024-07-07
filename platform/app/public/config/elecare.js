/** @type {AppTypes.Config} */

window.config = (() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dicomUrl = urlParams.get('dicomUrl');
    const token = urlParams.get('token') || urlParams.get('oauthToken');

    console.log('[[window.config]] - v.0.0.1');
    console.log('dicomUrl:', dicomUrl);
    console.log('token:', token);

    return {
        routerBasename: '/',
        extensions: [],
        modes: [],
        customizationService: {},
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
        defaultDataSourceName: 'dicomweb',
        dataSources: [
            {
                namespace: '@ohif/extension-default.dataSourcesModule.dicomweb',
                sourceName: 'dicomweb',
                configuration: {
                    friendlyName: 'dcmjs DICOMWeb Server',
                    name: 'GCP',
                    wadoUriRoot: dicomUrl,
                    qidoRoot: dicomUrl,
                    wadoRoot: dicomUrl,
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
                    },
                },
            },
        ],
        httpErrorHandler: error => {
            console.log('[[httpErrorHandler]]');
            console.log('dicomUrl:', dicomUrl);
            console.log('token:', token);
            console.log(error);
        },
    };
})();
