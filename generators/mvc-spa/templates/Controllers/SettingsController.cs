
using DotNetNuke.Collections;
using DotNetNuke.Security;
using DotNetNuke.Web.Mvc.Framework.ActionFilters;
using System;
using System.Web.Mvc;
using <%= fullNamespace %>.Components;
using <%= fullNamespace %>.Models;

namespace <%= fullNamespace %>.Controllers
{
    [DnnModuleAuthorize(AccessLevel = SecurityAccessLevel.Edit)]
    [DnnHandleError]
    public class SettingsController : <%= extensionName %>ModuleControllerBase
    {
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult Settings()
        {
            var settings = new Settings();

            settings.Setting1 = ModuleContext.Configuration.ModuleSettings.GetValueOrDefault("<%= fullNamespace %>_Setting1", false);
            settings.Setting2 = ModuleContext.Configuration.ModuleSettings.GetValueOrDefault("<%= fullNamespace %>_Setting2", string.Empty);
            settings.Setting3 = ModuleContext.Configuration.ModuleSettings.GetValueOrDefault("<%= fullNamespace %>_Setting3", DateTime.Now);

            return View(settings);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="settings"></param>
        /// <returns></returns>
        [HttpPost]
        [ValidateInput(false)]
        [DotNetNuke.Web.Mvc.Framework.ActionFilters.ValidateAntiForgeryToken]
        public ActionResult Settings(Settings settings)
        {
			var security = new PortalSecurity();
			
            ModuleContext.Configuration.ModuleSettings["<%= fullNamespace %>_Setting1"] = security.InputFilter(settings.Setting1.ToString().Trim(), PortalSecurity.FilterFlag.NoMarkup);

            var setting2 = settings.Setting2.Trim();
            if (!string.IsNullOrEmpty(setting2))
            {
                ModuleContext.Configuration.ModuleSettings["<%= fullNamespace %>_Setting2"] =
                    security.InputFilter(setting2, PortalSecurity.FilterFlag.NoMarkup);
            }
            else if(ModuleContext.Configuration.ModuleSettings.ContainsKey("<%= fullNamespace %>_Setting2"))
            {
                ModuleContext.Configuration.ModuleSettings.Remove("<%= fullNamespace %>_Setting2");
            }

            ModuleContext.Configuration.ModuleSettings["<%= fullNamespace %>_Setting3"] = security.InputFilter(settings.Setting3.ToUniversalTime().ToString("u"), PortalSecurity.FilterFlag.NoMarkup);

            return RedirectToDefaultRoute();
        }
    }
}