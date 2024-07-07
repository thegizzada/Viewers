/** @type {AppTypes.Config} */

window.config = (() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dicomUrl = urlParams.get('dicomUrl');
    const token = urlParams.get('token') || urlParams.get('oauthToken');

    console.log('[[window.config]] - v.0.0.6');
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
        oidc: [
            {
                // ~ REQUIRED
                // Authorization Server URL
                authority: 'https://accounts.google.com',
                client_id: '832012968033-184un2snjqtl8ip9mh9isfm3299nb3l2.apps.googleusercontent.com',
                redirect_uri: 'https://dicom.elecare.ai/callback',
                response_type: 'id_token token',
                scope:
                    'email profile openid https://www.googleapis.com/auth/cloudplatformprojects.readonly https://www.googleapis.com/auth/cloud-healthcare', // email profile openid
                // ~ OPTIONAL
                post_logout_redirect_uri: '/logout-redirect.html',
                revoke_uri: 'https://accounts.google.com/o/oauth2/revoke?token=',
                automaticSilentRenew: true,
                revokeAccessTokenOnSignout: true,
            },
        ],
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
