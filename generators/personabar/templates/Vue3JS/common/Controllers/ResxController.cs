using DotNetNuke.Services.Localization;
using DotNetNuke.Web.Api;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Xml;
using <%= fullNamespace %>.Constants;

namespace <%= fullNamespace %>.Controllers

{
    [DnnAuthorize]
    public class ResxController: DnnApiController
    {
        /// <summary>
        /// Retrieves localized resource strings from a .resx file.
        /// </summary>
        /// <param name="filename">The name of the .resx file (without the .resx extension).</param>
        /// <returns>An HTTP response containing the localized resource strings in JSON format.</returns>
        [HttpGet]
        [ActionName("GetResx")]
        public HttpResponseMessage GetResx(string filename)
        {
            try
            {
                var resx = new JObject();
                string language = System.Threading.Thread.CurrentThread.CurrentCulture.Name;
                var resxRoot = $"{ModuleConstants.ResxPartialRoot}{filename}.{language}.resx";

                var filepath = HttpContext.Current.Server.MapPath(resxRoot);
                if (!File.Exists(filepath))
                {
                    // If the file does not exist, use the default resource file
                    resxRoot = $"{ModuleConstants.ResxPartialRoot}{filename}.resx";
                    filepath = HttpContext.Current.Server.MapPath(resxRoot);
                }
                var resxDoc = new XmlDocument();
                resxDoc.Load(filepath);

                foreach (XmlNode dataNode in resxDoc.DocumentElement.SelectNodes(ModuleConstants.RootData))
                {
                    var key = dataNode.Attributes[ModuleConstants.DataNodeAttributesName].Value;
                    var val = Localization.GetString(key.ToString(), resxRoot);

                    if (key.EndsWith(ModuleConstants.PointText, StringComparison.InvariantCultureIgnoreCase)) key = key.Substring(0, key.Length - 5);
                    key = key.Replace(".", "_");

                    resx.Add(key, val);
                }

                return Request.CreateResponse(resx);
            }
            catch (Exception)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, $"Resource file {filename}.resx not found");
            }
        }
    }
}