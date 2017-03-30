
import { Main } from './main';

require.config({
  // to set the default folder
  baseUrl: './base',
  paths: {
  },
  // shim: makes external libraries compatible with requirejs (AMD)
  shim: {
  },
  logLevel: require.config.LOG_INFO

  // dynamically load all test files
  // deps: allTestFiles,

  // we have to kickoff jasmine, as it is asynchronous
  // callback: window.__karma__.start
});
