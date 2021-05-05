using System.Linq;
using System.Net.Http;
using System.Collections.Generic;
using System.Net;
using System.Web.Http;
using <%= fullNamespace %>.Services.ViewModels;
using DotNetNuke.Web.Api;
using DotNetNuke.Security;
using DotNetNuke.Entities.Users;

namespace <%= fullNamespace %>.Services
{
    [SupportedModules("<%= moduleName %>")]
    [DnnModuleAuthorize(AccessLevel = SecurityAccessLevel.Edit)]
    public class UserController : DnnApiController
    {
        public UserController() { }

        public HttpResponseMessage Dummy()
        {
            return Request.CreateErrorResponse(HttpStatusCode.MethodNotAllowed, "Dummy called");
        }

        public HttpResponseMessage GetList()
        {
            var userlist = DotNetNuke.Entities.Users.UserController.GetUsers(this.PortalSettings.PortalId);
            var users = userlist.Cast<UserInfo>().ToList()
                   .Select(user => new UserViewModel(user))
                   .ToList();

            return Request.CreateResponse(users);
        }
    }
}