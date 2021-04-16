using <%= fullNamespace %>.Services.ViewModels;
using DotNetNuke.Entities.Users;
using DotNetNuke.Security;
using DotNetNuke.Web.Api;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;

namespace <%= fullNamespace %>.Services
{
    [SupportedModules("<%= extensionName %>")]
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
