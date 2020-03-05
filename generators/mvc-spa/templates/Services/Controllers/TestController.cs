
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DotNetNuke.Security;
using DotNetNuke.Web.Api;
using <%= fullNamespace %>.Components;

namespace <%= fullNamespace %>.Services
{
    public partial class ExampleController
    {
        /// <summary>
        /// Use to test a successful response
        /// </summary>
        /// <returns></returns>
        /// <remarks>
        /// GET: http://dnndev.me/DesktopModules/MVC/<%= fullNamespace %>/API/Event/Ping
        /// </remarks>
        [AllowAnonymous]
        [HttpGet]
        public HttpResponseMessage Ping()
        {
            var response = new ServiceResponse<string>() { Content = "Success" };

            return Request.CreateResponse(HttpStatusCode.OK, response.ObjectToJson());
        }

        /// <summary>
        /// Use to test a failed response
        /// </summary>
        /// <returns></returns>
        /// <remarks>
        /// GET: http://dnndev.me/DesktopModules/MVC/<%= fullNamespace %>/API/Event/PingError
        /// </remarks>
        [AllowAnonymous]
        [HttpGet]
        public HttpResponseMessage PingError()
        {
            var errors = new List<ServiceError>();

            errors.Add(new ServiceError()
            {
                Code = "NULL",
                Description = "NullReferenceException stack trace"
            });

            var response = new ServiceResponse<string>()
            {
                Errors = errors
            };

            return Request.CreateResponse(HttpStatusCode.OK, response.ObjectToJson());
        }

        /// <summary>
        /// Use to test a failed response
        /// </summary>
        /// <returns></returns>
        /// <remarks>
        /// GET: http://dnndev.me/DesktopModules/MVC/<%= fullNamespace %>/API/Event/PingException
        /// </remarks>
        [AllowAnonymous]
        [HttpGet]
        public HttpResponseMessage PingException()
        {
            return Request.CreateResponse(HttpStatusCode.InternalServerError);
        }

        /// <summary>
        /// Use to test a failed response
        /// </summary>
        /// <returns></returns>
        /// <remarks>
        /// GET: http://dnndev.me/DesktopModules/MVC/<%= fullNamespace %>/API/Event/PingNotFound
        /// </remarks>
        [AllowAnonymous]
        [HttpGet]
        public HttpResponseMessage PingNotFound()
        {
            return Request.CreateResponse(HttpStatusCode.NotFound);
        }

        /// <summary>
        /// Use to test for security credentials
        /// </summary>
        /// <returns />
        /// <remarks>
        /// GET: http://dnndev.me/DesktopModules/MVC/<%= fullNamespace %>/API/Event/PingSecurityCheck
        /// </remarks>
        [DnnModuleAuthorize(AccessLevel = SecurityAccessLevel.Edit)]
        [ValidateAntiForgeryToken]
        [HttpGet]
        public HttpResponseMessage PingSecurityCheck()
        {
            // this response should only be reached if the user is allowed to edit the module
            // otherwise, they'll be automatically met with a 401 unauthorized error
            var response = new ServiceResponse<string>() { Content = "Success" };

            return Request.CreateResponse(HttpStatusCode.OK, response.ObjectToJson());
        }
    }
}