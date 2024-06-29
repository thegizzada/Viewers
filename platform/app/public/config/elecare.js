/** @type {AppTypes.Config} */

window.config = (() => {
    const urlParams = new URLSearchParams(window.location.search);
    const dicomUrl = urlParams.get('dicomUrl');

    return {
        routerBasename: '/',
        extensions: [],
        modes: [],
        customizationService: {},
        showStudyList: true,
        maxNumberOfWebWorkers: 3,
        showWarningMessageForCrossOrigin: true,
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
                    friendlyName: 'AWS S3 DICOMWeb Server',
                    name: 'S3DICOM',
                    wadoUriRoot: dicomUrl || 'https://dicom.elecare.ai/wado', // Use dynamic URL or fallback to default
                    qidoRoot: dicomUrl || 'https://dicom.elecare.ai/qido',
                    wadoRoot: dicomUrl || 'https://dicom.elecare.ai/rs',
                    qidoSupportsIncludeField: true,
                    supportsReject: true,
                    imageRendering: 'wadors',
                    thumbnailRendering: 'wadors',
                    enableStudyLazyLoad: true,
                    supportsFuzzyMatching: true,
                    supportsWildcard: true,
                    omitQuotationForMultipartRequest: true,
                },
            },
        ],
        httpErrorHandler: error => {
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
