'use strict';

var fs = require('fs');
var _ = require('lodash');

var normalizeBuildConfig = function(build, name) {
  var normalized = {
    exec: build.cmd,
    env: build.env,
    args: build.args,
    cwd: build.cwd,
    sh: build.sh,
    errorMatch: build.errorMatch,
  };
  if (!name) {
    normalized.builds = {};
    _.forEach(build.builds, function(namedBuild, name) {
      normalized.builds[name] = normalizeBuildConfig(namedBuild, name);
    });
  }
  return normalized;
};

module.exports.isEligable = function (path) {
  return fs.existsSync(path + '/.atom-build.json');
};

module.exports.settings = function (path) {
  var realAtomBuild = fs.realpathSync(path + '/.atom-build.json');
  delete require.cache[realAtomBuild];

  var build = require(realAtomBuild);

  return normalizeBuildConfig(build);
};
