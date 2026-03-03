const { withAndroidManifest } = require("expo/config-plugins");

/**
 * Config plugin to fix AndroidManifest conflicts between expo-secure-store and appsflyer
 * Adds tools:replace attribute to resolve dataExtractionRules and fullBackupContent conflicts
 */
function withAndroidManifestFix(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    
    // Ensure the tools namespace is declared
    if (!androidManifest.manifest.$["xmlns:tools"]) {
      androidManifest.manifest.$["xmlns:tools"] = "http://schemas.android.com/tools";
    }
    
    // Get the application element
    const application = androidManifest.manifest.application?.[0];
    if (application) {
      // Add tools:replace to resolve conflicts
      application.$["tools:replace"] = "android:dataExtractionRules,android:fullBackupContent";
    }
    
    return config;
  });
}

module.exports = withAndroidManifestFix;
