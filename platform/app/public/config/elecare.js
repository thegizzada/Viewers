/** @type {AppTypes.Config} */

window.config = (() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dicomUrl = urlParams.get('dicomUrl');
    if (!dicomUrl) { throw new Error('dicomUrl is required'); }
    const oauthToken = urlParams.get('oauthToken');
    if (!oauthToken) { throw new Error('oauthToken is required'); }

    console.log('dicomUrl:', dicomUrl);
    console.log('oauthToken:', oauthToken);

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
                    friendlyName: 'ElecareAI DICOM URL',
                    name: 'S3DICOM',
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
                        'Authorization': `Bearer ${oauthToken}`
                    },
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
