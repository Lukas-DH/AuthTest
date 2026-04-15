const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Fixes @react-native-firebase build error when useFrameworks: "static" is enabled.
 * Adds CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES = YES to all pod targets
 * so that RNFB Objective-C code can import React headers inside a framework module.
 */
const withRNFirebaseFix = (config) => {
  return withDangerousMod(config, [
    'ios',
    (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');
      const tag = '# @rnfirebase/framework-fix';
      if (!podfile.includes(tag)) {
        podfile = podfile.replace(
          'post_install do |installer|',
          `post_install do |installer|\n  ${tag}\n  installer.pods_project.targets.each do |target|\n    target.build_configurations.each do |build_config|\n      build_config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'\n    end\n  end`
        );
        fs.writeFileSync(podfilePath, podfile);
      }
      return config;
    },
  ]);
};

module.exports = withRNFirebaseFix;
