// versionUtils.js
function removeLeadingZeros(version) {
    // Split the version number into parts separated by periods
    const versionParts = version.split('.');
  
    // Remove leading zeros from each part
    const cleanedVersionParts = versionParts.map(part => parseInt(part).toString());
  
    // Join the cleaned parts back together with periods
    const cleanedVersion = cleanedVersionParts.join('.');
  
    return cleanedVersion;
  }

  module.exports = {
    removeLeadingZeros
  };