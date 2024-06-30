/** @type {AppTypes.Config} */

window.config = (() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dicomUrl = urlParams.get('dicomUrl');
    const token = urlParams.get('token') || urlParams.get('oauthToken');

    return {
        routerBasename: '/',
        // This is an array, but we'll only use the first entry for now
        oidc: [
            {
                // ~ REQUIRED
                // Authorization Server URL
                authority: 'https://accounts.google.com',
                client_id: '832012968033-184un2snjqtl8ip9mh9isfm3299nb3l2.apps.googleusercontent.com',
                redirect_uri: '/callback',
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
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                },
            },
            {
                friendlyName: 'dcmjs DICOMWeb Server',
                namespace: '@ohif/extension-default.dataSourcesModule.dicomweb',
                sourceName: 'dicomweb',
                configuration: {
                    name: 'GCP',
                    wadoUriRoot: dicomUrl,
                    qidoRoot: dicomUrl,
                    wadoRoot: dicomUrl,
                    qidoSupportsIncludeField: true,
                    imageRendering: 'wadors',
                    thumbnailRendering: 'wadors',
                    enableStudyLazyLoad: true,
                    supportsFuzzyMatching: true,
                    supportsWildcard: false,
                    dicomUploadEnabled: true,
                },
            },
        ],
        httpErrorHandler: error => {
            console.log('[[httpErrorHandler]]');
            console.log('dicomUrl:', dicomUrl);
            console.log('oauthToken:', oauthToken);
            console.warn(error.status);
            console.warn('test, navigate to https://ohif.org/');
        },
        hotkeys: [
            {
                commandName: 'incrementActiveViewport',
                label: 'Next Viewport',
                keys: ['right'],
            },
            {
                commandName: 'decrementActiveViewport',
                label: 'Previous Viewport',
                keys: ['left'],
            },
            { commandName: 'rotateViewportCW', label: 'Rotate Right', keys: ['r'] },
            { commandName: 'rotateViewportCCW', label: 'Rotate Left', keys: ['l'] },
            { commandName: 'invertViewport', label: 'Invert', keys: ['i'] },
            {
                commandName: 'flipViewportHorizontal',
                label: 'Flip Horizontally',
                keys: ['h'],
            },
            {
                commandName: 'flipViewportVertical',
                label: 'Flip Vertically',
                keys: ['v'],
            },
            { commandName: 'scaleUpViewport', label: 'Zoom In', keys: ['+'] },
            { commandName: 'scaleDownViewport', label: 'Zoom Out', keys: ['-'] },
            { commandName: 'fitViewportToWindow', label: 'Zoom to Fit', keys: ['='] },
            { commandName: 'resetViewport', label: 'Reset', keys: ['space'] },
            { commandName: 'nextImage', label: 'Next Image', keys: ['down'] },
            { commandName: 'previousImage', label: 'Previous Image', keys: ['up'] },
            {
                commandName: 'setToolActive',
                commandOptions: { toolName: 'Zoom' },
                label: 'Zoom',
                keys: ['z'],
            },
            {
                commandName: 'windowLevelPreset1',
                label: 'W/L Preset 1',
                keys: ['1'],
            },
            {
                commandName: 'windowLevelPreset2',
                label: 'W/L Preset 2',
                keys: ['2'],
            },
            {
                commandName: 'windowLevelPreset3',
                label: 'W/L Preset 3',
                keys: ['3'],
            },
            {
                commandName: 'windowLevelPreset4',
                label: 'W/L Preset 4',
                keys: ['4'],
            },
            {
                commandName: 'windowLevelPreset5',
                label: 'W/L Preset 5',
                keys: ['5'],
            },
            {
                commandName: 'windowLevelPreset6',
                label: 'W/L Preset 6',
                keys: ['6'],
            },
            {
                commandName: 'windowLevelPreset7',
                label: 'W/L Preset 7',
                keys: ['7'],
            },
            {
                commandName: 'windowLevelPreset8',
                label: 'W/L Preset 8',
                keys: ['8'],
            },
            {
                commandName: 'windowLevelPreset9',
                label: 'W/L Preset 9',
                keys: ['9'],
            },
        ],
    };
})();
