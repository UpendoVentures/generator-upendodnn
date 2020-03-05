
using DotNetNuke.Framework.JavaScriptLibraries;
using DotNetNuke.Web.Mvc.Framework.ActionFilters;
using System.Web.Mvc;
using DotNetNuke.Framework;
using <%= fullNamespace %>.Components;
using <%= fullNamespace %>.Data;

namespace <%= fullNamespace %>.Controllers
{
    [DnnHandleError]
    public class ExampleController : <%= extensionName %>ModuleControllerBase
    {
        public ActionResult Index()
        {
            DotNetNuke.Framework.JavaScriptLibraries.JavaScript.RequestRegistration(CommonJs.DnnPlugins);
            ServicesFramework.Instance.RequestAjaxAntiForgerySupport();

            var items = ExampleInfoRepository.Instance.GetItems(ModuleContext.ModuleId);

            ViewBag.PortalId = ModuleContext.PortalId;
            ViewBag.ModuleId = ModuleContext.ModuleId;
            ViewBag.ModulePath = $"/DesktopModules/MVC/{ModuleContext.Configuration.DesktopModule.FolderName}/";

            return View(items);
        }
    }
}
