using DotNetNuke.Services.Localization;
using System.IO;
using System.Web;
using <%= fullNamespace %>.Constants;
using <%= fullNamespace %>.Services.Interfaces;

namespace <%= fullNamespace %>.Services
{
    /// <summary>
    /// Provides functionality to retrieve localized strings from resource files based on the current culture.
    /// </summary>
    /// <remarks>
    /// The Resx class is designed to facilitate internationalization by managing resource files that contain localized strings.
    /// It automatically selects the appropriate resource file based on the current thread's culture. If a specific resource file
    /// for the current culture does not exist, it falls back to a default resource file. This class provides a method to retrieve
    /// localized strings using a key. If the key is not found in the resource file, an empty string is returned.
    /// </remarks>
    public class ResxService:IResxService
    {
        private readonly string ResourceFile;
        /// <summary>
        /// Initializes a new instance of the Resx class, setting the resource file based on the current culture.
        /// </summary>
        /// <remarks>
        /// This constructor determines the current culture's name and constructs a path to a corresponding
        /// resource file. It checks if the resource file exists at the constructed path. If the file does not
        /// exist, it falls back to using a default resource file. The path to the resource file is stored in
        /// the ResourceFile property.
        /// </remarks>
        public ResxService()
        {
            string language = System.Threading.Thread.CurrentThread.CurrentCulture.Name;
            ResourceFile = $"{ModuleConstants.ResxPartialRoot}{ModuleConstants.RESX_NAME}.{language}.resx";
            var filepath = HttpContext.Current.Server.MapPath(ResourceFile);
            if (!File.Exists(filepath))
            {
                // If the file does not exist, use the default resource file
                ResourceFile = $"{ModuleConstants.ResxPartialRoot}{ModuleConstants.RESX_NAME}.resx";
            }
        }

        /// <summary>
        /// Retrieves the localized string for the specified key.
        /// </summary>
        /// <param name="key">The key for the localized string.</param>
        /// <returns>
        /// The localized string associated with the specified key. If the key is null or empty,
        /// or if the localized string is not found, an empty string is returned.
        /// </returns>
        /// <remarks>
        /// This method first checks if the key is null or empty, returning an empty string if true.
        /// If the key does not contain the predefined resource key identifier, it appends this identifier
        /// to the key. It then attempts to retrieve the localized string from the resource file.
        /// If the localized string is not found, an empty string is returned.
        /// </remarks>
        public string GetLocalization(string key)
        {
            if (string.IsNullOrEmpty(key))
            {
                return string.Empty;
            }

            if (!key.Contains(ModuleConstants.PointText))
            {
                key = $"{key}{ModuleConstants.PointText}";
            }
            var result = Localization.GetString(key, ResourceFile);
            return result ?? string.Empty;
        }
    }
}