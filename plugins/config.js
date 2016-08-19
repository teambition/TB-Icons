export const ICONFONTS = {
  formats: [
    'eot',
    'svg',
    'ttf',
    'woff',
    'woff2'
  ],
  fontName: 'tb-icons',
  normalize: true,
  timestamp: Date.now(),
  centerHorizontally: true,
  fontHeight: 1000
}

export const SKETCH = {
  export: 'slices',
  compact: true,
  formats: 'svg',
  verbose: process.env.NODE_ENV !== 'build'
}

export const svgoConfig = (defaultValue = true) => {
  return {
    js2svg: {
      pretty: true
    },
    plugins: [
      { "addClassesToSVGElement": false },
      { "cleanupAttrs": true },
      { "cleanupEnableBackground": true },
      { "cleanupIDs": defaultValue },
      { "cleanupListOfValues": true },
      { "cleanupNumericValues": true },
      { "collapseGroups": true },
      { "convertColors": true },
      { "convertPathData":
        {
          "applyTransforms": true,
          "applyTransformsStroked": true,
          "collapseRepeated": true,
          "curveSmoothShorthands": true,
          "floatPrecision": 3,
          "leadingZero": true,
          "lineShorthands": true,
          "makeArcs": {
            "threshold": 10,
            "tolerance": 0.5
          },
          "negativeExtraSpace": true,
          "removeUseless": true,
          "straightCurves": true,
          "transformPrecision": 5,
          "utilizeAbsolute": true
        }
      },
      { "convertShapeToPath": true },
      { "convertStyleToAttrs": true },
      { "convertTransform": true },
      { "mergePaths": true },
      { "minifyStyles": true },
      { "moveElemsAttrsToGroup": true },
      { "moveGroupAttrsToElems": true },
      { "removeAttrs": {
          attrs: '(fill|fill-rule)'
        }
      },
      { "removeComments": true },
      { "removeDesc": true },
      { "removeDimensions": true },
      { "removeDoctype": true },
      { "removeEditorsNSData": true },
      { "removeEmptyAttrs": true },
      { "removeEmptyContainers": true },
      { "removeEmptyText": true },
      { "removeHiddenElems": true },
      { "removeMetadata": true },
      { "removeNonInheritableGroupAttrs": true },
      { "removeRasterImages": true },
      { "removeStyleElement": true },
      { "removeTitle": true },
      { "removeUnknownsAndDefaults": true },
      { "removeUnusedNS": true },
      { "removeUselessDefs": true },
      { "removeUselessStrokeAndFill": true },
      { "removeViewBox": false },
      { "removeXMLProcInst": true },
      { "sortAttrs": true },
      { "transformsWithOnePath": true }
    ]
  }
}

export const SVGSYMBOLS = {
  templates: [
    'default-svg'
  ]
}
