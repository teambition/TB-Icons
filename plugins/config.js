export const ICONFONTS = {
  formats: [
    'eot',
    'svg',
    'ttf',
    'woff',
    'woff2'
  ],
  fontName: 'tb-icons',
  timestamp: Date.now()
}

export const SKETCH = {
  export: 'slices',
  formats: 'svg',
  verbose: process.env.NODE_ENV === 'dev'
}

export const SKETCH_SVGMIN = {
  js2svg: {
    pretty: true
  },
  plugins: [
    { cleanupAttrs: true },
    { cleanupEnableBackground: true },
    { cleanupIDs: true },
    { cleanupListOfValues: true },
    { cleanupNumericValues: true },
    { collapseGroups: true },
    { convertColors: true },
    { convertPathData: true },
    { convertShapeToPath: true },
    { convertStyleToAttrs: true },
    { convertTransform: true },
    { mergePaths: true },
    { minifyStyles: true },
    { moveElemsAttrsToGroup: true },
    { moveGroupAttrsToElems: true },
    { removeAttrs: true },
    { removeComments: true },
    { removeDesc: true },
    { removeDimensions: true },
    { removeDoctype: true },
    { removeEditorsNSData: true },
    { removeEmptyAttrs: true },
    { removeEmptyContainers: true },
    { removeEmptyText: true },
    { removeHiddenElems: true },
    { removeMetadata: true },
    { removeNonInheritableGroupAttrs: true },
    { removeRasterImages: true },
    { removeStyleElement: true },
    { removeTitle: true },
    { removeUnknownsAndDefaults: true },
    { removeUnusedNS: true },
    { removeUselessDefs: true },
    { removeUselessStrokeAndFill: true },
    { removeViewBox: false },
    { removeXMLProcInst: true },
    { sortAttrs: true },
    { transformsWithOnePath: true }
  ]
}

export const SVGSYMBOLS = {
  templates: [
    'default-svg'
  ]
}

export const SVGSYMBOLS_SVGMIN = {
  js2svg: {
    pretty: true
  },
  plugins: [
    { cleanupIDs: false },
    { removeStyleElement: false },
    { removeUselessDefs: true },
    { removeViewBox: false },
    { sortAttrs: true }
  ]
}
