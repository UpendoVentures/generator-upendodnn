using DotNetNuke.Web.Api;

namespace <%= fullNamespace %>.Services
{
    public class ServiceRouteMapper : IServiceRouteMapper
    {
        /// <summary>
        /// RegisterRoutes is used to register the module's routes
        /// </summary>
        /// <param name="mapRouteManager"></param>
        public void RegisterRoutes(IMapRoute mapRouteManager)
        {
            mapRouteManager.MapHttpRoute(
                moduleFolderName: "<%= fullNamespace %>",
                routeName: "default",
                url: "{controller}/{action}",
                namespaces: new[] { "<%= fullNamespace %>.Controllers" });
        }
    }
}