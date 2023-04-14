// module.exports = function(base) {
//     return {
//         ...base,
//         optimization: {
//             splitChunks: {
//               chunks: 'async',
//               minSize: 20000,
//               minRemainingSize: 0,
//               minChunks: 1,
//               maxAsyncRequests: 30,
//               maxInitialRequests: 30,
//               enforceSizeThreshold: 50000,
//               cacheGroups: {
//                 defaultVendors: {
//                   test: /[\\/]node_modules[\\/]/,
//                   priority: -10,
//                   reuseExistingChunk: true,
//                 },
//                 default: {
//                   minChunks: 2,
//                   priority: -20,
//                   reuseExistingChunk: true,
//                 },
//               },
//             },
//           },
//     }
// }


module.exports = function(base) {
    return {
        ...base,
        optimization: {
          ...base.optimization,
          splitChunks: {
            ...base.optimization.splitChunks,
            cacheGroups: {
              ...base.optimization.splitChunks.cacheGroups,
              myCustomChunk: {
                test: /MyCustomRegexpToGrabFiles/, // search files by pattern
                enforce: true,                     // always split this chunk
                name: 'myCustomChunk',             // name will be myCustomChunk.js
                chunks: 'all'                      // split it from lazy and common chunks
              }
            }
          }
        }
    }
}