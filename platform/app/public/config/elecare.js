window.config = (() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dicomUrl = urlParams.get('dicomUrl');
    const token = urlParams.get('token') || urlParams.get('oauthToken');

    if (!dicomUrl || !token) {
        console.error('DICOM URL or token is missing.');
        return;
    }

    return {
        routerBasename: '/',
        oidc: [
            {
                authority: 'https://accounts.google.com',
                client_id: '832012968033-184un2snjqtl8ip9mh9isfm3299nb3l2.apps.googleusercontent.com',
                redirect_uri: '/callback',
                response_type: 'id_token token',
                scope: 'email profile openid https://www.googleapis.com/auth/cloudplatformprojects.readonly https://www.googleapis.com/auth/cloud-healthcare',
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
                    friendlyName: 'ElecareAI DICOM Server',
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
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                },
            },
        ],
        // other configurations
        httpErrorHandler: error => {
            console.log('[[httpErrorHandler]]');
            console.log('dicomUrl:', dicomUrl);
            console.log('token:', token);
            console.warn(error.status);
            console.warn('test, navigate to https://ohif.org/');
        },
    };
})();
