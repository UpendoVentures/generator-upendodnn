/*
Copyright Upendo Ventures, LLC 

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE.
*/

using DotNetNuke.Services.Tokens;
using DotNetNuke.Entities.Modules;
using DotNetNuke.Entities.Portals;
using DotNetNuke.Entities.Users;
using DotNetNuke.Services.Localization;
using DotNetNuke.UI.Modules;
using Newtonsoft.Json;

using System.Collections.Generic;
using System.Linq;
using System.Globalization;
using System.Dynamic;
using System.Web;
using <%= fullNamespace %>;
using System.IO;
using System.Collections;
using System.Resources;

namespace <%= fullNamespace %>.Controllers
{
    public class ModulePropertiesPropertyAccess : IPropertyAccess
    {
        private ModuleInstanceContext _moduleContext;

        public ModulePropertiesPropertyAccess(ModuleInstanceContext moduleContext)
        {
            _moduleContext = moduleContext;
        }

        public string GetProperty(string propertyName, string format, CultureInfo formatProvider, UserInfo accessingUser, Scope accessLevel, ref bool propertyNotFound)
        {
            int moduleId = _moduleContext.ModuleId;
            int portalId = _moduleContext.PortalId;
            int tabId = _moduleContext.TabId;
            ModuleInfo module = new ModuleController().GetModule(moduleId, tabId);

            string moduleDirectory = string.Concat(Constants.SLASH, _moduleContext.Configuration.ModuleControl.ControlSrc);
            moduleDirectory = moduleDirectory.Substring(0, moduleDirectory.LastIndexOf('/') + 1);

            switch (propertyName.ToLower())
            {
                case Constants.Properties.PROPERTY_ALL:
                    dynamic properties = new ExpandoObject();
                    properties.Resources = GetResources(module);
                    properties.Settings = _moduleContext.Settings;
                    properties.IsEditable = _moduleContext.IsEditable;
                    properties.EditMode = _moduleContext.EditMode;
                    properties.IsAdmin = accessingUser.IsInRole(PortalSettings.Current.AdministratorRoleName);
                    properties.ModuleId = _moduleContext.ModuleId;
                    properties.PortalId = _moduleContext.PortalId;
                    properties.UserId = accessingUser.UserID;
                    properties.HomeDirectory = PortalSettings.Current.HomeDirectory.Substring(1);
                    properties.ModuleDirectory = moduleDirectory;
                    properties.RawUrl = HttpContext.Current.Request.RawUrl;
                    properties.PortalLanguages = GetPortalLanguages();
                    properties.CurrentLanguage = System.Threading.Thread.CurrentThread.CurrentCulture.Name;
                    properties.routingWebAPI = Constants.APIPath;
                    properties.TabId = _moduleContext.TabId;

                    return JsonConvert.SerializeObject(properties);

                case Constants.Properties.PROPERTY_MODULEPATH:
                    return moduleDirectory;
                case Constants.Properties.PROPERTY_APPROOT_BEGIN:
                    return string.Format(Constants.Properties.APPROOT_OPEN, moduleId);
                case Constants.Properties.PROPERTY_APPROOT_END:
                    return string.Format(Constants.Properties.APPROOT_CLOSE, moduleId);
                case Constants.Properties.PROPERTY_MODULEID:
                    return _moduleContext.ModuleId.ToString();
                case Constants.Properties.PROPERTY_RAWURL:
                    return HttpContext.Current.Request.RawUrl;
                case Constants.Properties.PROPERTY_TEST:
                    return Constants.Properties.PROPERTY_TEST;

            }
            return string.Empty;
        }

        public CacheLevel Cacheability
        {
            get { return CacheLevel.notCacheable; }
        }

        private Dictionary<string, string> GetResources(ModuleInfo module)
        {
            var currentLanguage = System.Threading.Thread.CurrentThread.CurrentCulture.Name;
            System.IO.FileInfo fi = new System.IO.FileInfo(HttpContext.Current.Server.MapPath(string.Format(Constants.Properties.LOCALIZATION_PATH_FORMAT, _moduleContext.Configuration.ModuleControl.ControlSrc, currentLanguage)));
            string physResourceFile = string.Format(Constants.Properties.PHYSICAL_FILE_FORMAT, fi.DirectoryName, Constants.Resources, fi.Name);
            string relResourceFile = string.Format(Constants.Properties.RELATIVE_FILE_FORMAT, Constants.DesktopModules, module.DesktopModule.FolderName, Constants.Resources, fi.Name);
            if (File.Exists(physResourceFile))
            {
                using (var rsxr = new ResXResourceReader(physResourceFile))
                {
                    var res = rsxr.OfType<DictionaryEntry>()
                        .ToDictionary(
                            entry => entry.Key.ToString().Replace(Constants.DOT, Constants.UNDERSCORE),
                            entry => Localization.GetString(entry.Key.ToString(), relResourceFile));

                    return res;
                }
            }
            return new Dictionary<string, string>();
        }

        private List<string> GetPortalLanguages()
        {
            List<string> languages = new List<string>();
            LocaleController lc = new LocaleController();
            Dictionary<string, Locale> loc = lc.GetLocales(_moduleContext.PortalId);
            foreach (KeyValuePair<string, Locale> item in loc)
            {
                string cultureCode = item.Value.Culture.Name;
                languages.Add(cultureCode);
            }
            return languages;
        }
    }
}
