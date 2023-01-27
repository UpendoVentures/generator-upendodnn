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

using System.Net.Http;
using System.Net;
using System.Web.Http;
using DotNetNuke.Entities.Modules;
using DotNetNuke.Web.Api;
using DotNetNuke.Security;
using Telerik.Web.UI.Calendar.Utils;
using Upendo.Modules.TestVue.Common;
using Upendo.Modules.TestVue.Services.ViewModels;

namespace Upendo.Modules.TestVue.Services
{
    [SupportedModules("TestVue")]
    [DnnModuleAuthorize(AccessLevel = SecurityAccessLevel.Edit)]
    public class SettingsController : DnnApiController
    {
        public SettingsController() { }

        [HttpGet]  //[baseURL]/settings/load
        
        public HttpResponseMessage LoadSettings()
        {
            var settings = new SettingsViewModel();
           
            if (ActiveModule.ModuleSettings.ContainsKey(QuickSettings.MODSETTING_Name))
            {
                settings.Name = ActiveModule.ModuleSettings[QuickSettings.MODSETTING_Name].ToString();
            }
            if (ActiveModule.ModuleSettings.ContainsKey(QuickSettings.MODSETTING_Description))
            {
                settings.Description = ActiveModule.ModuleSettings[QuickSettings.MODSETTING_Description].ToString();
            }
            if (ActiveModule.ModuleSettings.ContainsKey(QuickSettings.MODSETTING_CreatedByUserId))
            {
                settings.CreatedByUserId = ActiveModule.ModuleSettings[QuickSettings.MODSETTING_CreatedByUserId].ToString();
            }
            if (ActiveModule.ModuleSettings.ContainsKey(QuickSettings.MODSETTING_AssignedUserId))
            {
                settings.AssignedUserId = ActiveModule.ModuleSettings[QuickSettings.MODSETTING_AssignedUserId].ToString();
            }
            if (ActiveModule.ModuleSettings.ContainsKey(QuickSettings.MODSETTING_ItemId))
            {
                settings.ItemId = ActiveModule.ModuleSettings[QuickSettings.MODSETTING_ItemId].ToString();
            }
            if (ActiveModule.ModuleSettings.ContainsKey(QuickSettings.MODSETTING_CreatedOnDate))
            {
                settings.CreatedOnDate = ActiveModule.ModuleSettings[QuickSettings.MODSETTING_CreatedOnDate].ToString();
            }

            return Request.CreateResponse(HttpStatusCode.OK, settings);
        }

        [HttpPost]  //[baseURL]/settings/save
        [ActionName("save")]
        [ValidateAntiForgeryToken]
        public HttpResponseMessage SaveSettings(SettingsViewModel settings)
        {
            ModuleController.Instance.UpdateModuleSetting(ActiveModule.ModuleID, QuickSettings.MODSETTING_Name, settings.Name);
            ModuleController.Instance.UpdateModuleSetting(ActiveModule.ModuleID, QuickSettings.MODSETTING_Description, settings.Description);
            ModuleController.Instance.UpdateModuleSetting(ActiveModule.ModuleID, QuickSettings.MODSETTING_CreatedByUserId, settings.CreatedByUserId);
            ModuleController.Instance.UpdateModuleSetting(ActiveModule.ModuleID, QuickSettings.MODSETTING_AssignedUserId, settings.AssignedUserId);
            ModuleController.Instance.UpdateModuleSetting(ActiveModule.ModuleID, QuickSettings.MODSETTING_ItemId, settings.ItemId);
            ModuleController.Instance.UpdateModuleSetting(ActiveModule.ModuleID, QuickSettings.MODSETTING_CreatedOnDate, settings.CreatedOnDate);

            return Request.CreateResponse(HttpStatusCode.OK, "Success");
        }
    }
    
}
