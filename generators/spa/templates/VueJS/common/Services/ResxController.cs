using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using DotNetNuke.Security;
using DotNetNuke.Web.Api;
using <%= fullNamespace %>.Components.BaseClasses;
using <%= fullNamespace %>.Services.ViewModels;
using Newtonsoft.Json.Linq;
using System.Resources;
using DotNetNuke.Services.Localization;

namespace <%= fullNamespace %>.Services
{
    [SupportedModules("<%= moduleName %>")]
    [DnnModuleAuthorize(AccessLevel = SecurityAccessLevel.View)]
    public class ResxController : ApiControllerBase
    {
        public HttpResponseMessage Get(string filename)
        {
            var resx = new JObject();

            var resxRoot = $"~\\DesktopModules\\<%= moduleName %>\\App_LocalResources\\{filename}.resx";
            var filepath = HttpContext.Current.Server.MapPath(resxRoot);
            var resxReader = new ResXResourceReader(filepath);

            var dict = resxReader.GetEnumerator();
            while (dict.MoveNext())
            {
                var key = dict.Key.ToString();
                if (key.EndsWith(".text", StringComparison.InvariantCultureIgnoreCase)) key = key.Substring(0, key.Length - 5);
                key = key.Replace(".", "_");
                var val = Localization.GetString(dict.Key.ToString(), resxRoot);

                resx.Add(key, val);
            }

            return Request.CreateResponse(resx);
        }
    }
}