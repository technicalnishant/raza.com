module.exports = {
  packages: {
	  '@ngmodule/material-carousel':  {
      ignorableDeepImportMatchers: [
        /@angular\//
      ]
    },
	  'angular2-text-mask': {
      ignorableDeepImportMatchers: [
        /text-mask-core\//,
      ]
    },
    
  }
};