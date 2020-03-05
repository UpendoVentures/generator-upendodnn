
using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DotNetNuke.Entities.Users;
using DotNetNuke.Security;
using DotNetNuke.Services.Exceptions;
using DotNetNuke.Web.Api;
using <%= fullNamespace %>.Components;

namespace <%= fullNamespace %>.Services
{
    public partial class ExampleController
    {
        /// <summary>
        /// Get an event
        /// </summary>
        /// <returns></returns>
        /// <remarks>
        /// GET: http://dnndev.me/DesktopModules/MVC/<%= fullNamespace %>/API/Event/GetCurrentUser
        /// </remarks>
        [DnnModuleAuthorize(AccessLevel = SecurityAccessLevel.View)]
        [HttpGet]
        public HttpResponseMessage GetCurrentUser()
        {
            try
            {
                var currentUser = UserInfo;
                var response = new ServiceResponse<UserInfo> {Content = UserInfo};

                if (currentUser == null)
                {
                    ServiceResponseHelper<UserInfo>.AddNoneFoundError("currentUser", ref response);
                }

                return Request.CreateResponse(HttpStatusCode.OK, response.ObjectToJson());
            }
            catch (Exception ex)
            {
                Exceptions.LogException(ex);
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ERROR_MESSAGE);
            }
        }

        /// <summary>
        /// Get an event
        /// </summary>
        /// <returns></returns>
        /// <remarks>
        /// GET: http://dnndev.me/DesktopModules/MVC/<%= fullNamespace %>/API/Event/GetCurrentUserId
        /// </remarks>
        [DnnModuleAuthorize(AccessLevel = SecurityAccessLevel.View)]
        [HttpGet]
        public HttpResponseMessage GetCurrentUserId()
        {
            try
            {
                var currentUserId = UserInfo.UserID;
                var response = new ServiceResponse<int> { Content = currentUserId };

                return Request.CreateResponse(HttpStatusCode.OK, response.ObjectToJson());
            }
            catch (Exception ex)
            {
                Exceptions.LogException(ex);
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ERROR_MESSAGE);
            }
        }
    }
}