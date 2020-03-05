
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DotNetNuke.Security;
using DotNetNuke.Security.Permissions;
using DotNetNuke.Services.Exceptions;
using DotNetNuke.Web.Api;
using <%= fullNamespace %>.Components;
using <%= fullNamespace %>.Models;

namespace <%= fullNamespace %>.Services
{
    /// <summary>
    /// This is a partial class that spans multiple class files, in order to keep the code manageable. Each method is necessary to support the front end SPA implementation.
    /// </summary>
    /// <remarks>
    /// The SupportModules attribute will require that all API calls set and include module headers, event GET requests. Even Fiddler will return 401 Unauthorized errors.
    /// </remarks>
    [SupportedModules("<%= extensionName %>")]
    public partial class ExampleController : ServiceBase
    {
        /// <summary>
        /// Get an event
        /// </summary>
        /// <returns></returns>
        /// <remarks>
        /// GET: http://dnndev.me/DesktopModules/MVC/<%= fullNamespace %>/API/Example/GetExamples
        /// </remarks>
        [DnnModuleAuthorize(AccessLevel = SecurityAccessLevel.View)]
        [HttpGet]
        public HttpResponseMessage GetExamples()
        {
            try
            {
                var examples = ExampleDataAccess.GetItems(ActiveModule.ModuleID);
                var response = new ServiceResponse<List<ExampleInfo>> { Content = examples.ToList() };

                if (examples == null || !examples.Any())
                {
                    ServiceResponseHelper<List<ExampleInfo>>.AddNoneFoundError("ExampleInfo", ref response);
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
        /// GET: http://dnndev.me/DesktopModules/<%= fullNamespace %>/MVC/API/Example/GetExample
        /// </remarks>
        [DnnModuleAuthorize(AccessLevel = SecurityAccessLevel.View)]
        [HttpGet]
        public HttpResponseMessage GetExample(int exampleId)
        {
            try
            {
                var example = ExampleDataAccess.GetItem(exampleId, ActiveModule.ModuleID);
                var response = new ServiceResponse<ExampleInfo> { Content = example };

                if (example == null)
                {
                    ServiceResponseHelper<ExampleInfo>.AddNoneFoundError("ExampleInfo", ref response);
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
        /// Delete an event
        /// </summary>
        /// <returns></returns>
        /// <remarks>
        /// DELETE: http://dnndev.me/DesktopModules/<%= fullNamespace %>/MVC/API/Example/DeleteExample
        /// </remarks>
        [DnnModuleAuthorize(AccessLevel = SecurityAccessLevel.Edit)]
        [ValidateAntiForgeryToken]
        [HttpDelete]
        public HttpResponseMessage DeleteExample(int exampleId)
        {
            try
            {
                ExampleDataAccess.DeleteItem(exampleId, ActiveModule.ModuleID);
                var response = new ServiceResponse<string> { Content = SUCCESS_MESSAGE };

                return Request.CreateResponse(HttpStatusCode.OK, response.ObjectToJson());
            }
            catch (Exception ex)
            {
                Exceptions.LogException(ex);
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ERROR_MESSAGE);
            }
        }

        /// <summary>
        /// Create an event
        /// </summary>
        /// <returns></returns>
        /// <remarks>
        /// POST: http://dnndev.me/DesktopModules/MVC/<%= fullNamespace %>/API/Example/CeateExample
        /// </remarks>
        [DnnModuleAuthorize(AccessLevel = SecurityAccessLevel.Edit)]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public HttpResponseMessage CreateExample(ExampleInfo newExample)
        {
            try
            {
                newExample.CreatedOnDate = DateTime.Now;
                newExample.CreatedByUserId = UserInfo.UserID;
                newExample.LastUpdatedOnDate = DateTime.Now;
                newExample.LastUpdatedByUserId = UserInfo.UserID;
                newExample.ModuleId = ActiveModule.ModuleID;

                var security = new PortalSecurity();

                newExample.Title = security.InputFilter(newExample.Title.Trim(), PortalSecurity.FilterFlag.NoMarkup);
                newExample.Description = security.InputFilter(newExample.Description.Trim(), PortalSecurity.FilterFlag.NoMarkup);

                ExampleDataAccess.CreateItem(newExample);

                var response = new ServiceResponse<string> { Content = Globals.RESPONSE_SUCCESS };

                return Request.CreateResponse(HttpStatusCode.OK, response.ObjectToJson());
            }
            catch (Exception ex)
            {
                Exceptions.LogException(ex);
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ERROR_MESSAGE);
            }
        }

        /// <summary>
        /// Update an event
        /// </summary>
        /// <returns></returns>
        /// <remarks>
        /// POST: http://dnndev.me/DesktopModules/MVC/<%= fullNamespace %>/API/Example/UpdateExample
        /// </remarks>
        [DnnModuleAuthorize(AccessLevel = SecurityAccessLevel.Edit)]
        [ValidateAntiForgeryToken]
        [HttpPost]
        public HttpResponseMessage UpdateExample(ExampleInfo example)
        {
            try
            {
                var originalExample = ExampleDataAccess.GetItem(example.ExampleId, example.ModuleId);
                var updatesToProcess = ExampleHasUpdates(ref originalExample, ref example);

                if (updatesToProcess)
                {
                    originalExample.LastUpdatedOnDate = DateTime.Now;
                    originalExample.LastUpdatedByUserId = UserInfo.UserID;

                    var security = new PortalSecurity();

                    originalExample.Title = security.InputFilter(originalExample.Title.Trim(), PortalSecurity.FilterFlag.NoMarkup);
                    originalExample.Description = security.InputFilter(originalExample.Description.Trim(), PortalSecurity.FilterFlag.NoMarkup);

                    ExampleDataAccess.UpdateItem(originalExample);
                }

                var savedExample = ExampleDataAccess.GetItem(originalExample.ExampleId, originalExample.ModuleId);

                var response = new ServiceResponse<ExampleInfo> { Content = savedExample };

                return Request.CreateResponse(HttpStatusCode.OK, response.ObjectToJson());
            }
            catch (Exception ex)
            {
                Exceptions.LogException(ex);
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ERROR_MESSAGE);
            }
        }

        /// <summary>
        /// Use to determine if the user has edit permissions
        /// </summary>
        /// <returns></returns>
        /// <remarks>
        /// GET: http://dnndev.me/DesktopModules/MVC/<%= fullNamespace %>/API/Example/UserCanEditExample
        /// </remarks>
        [AllowAnonymous]
        [HttpGet]
        public HttpResponseMessage UserCanEditExample()
        {
            ServiceResponse<string> response = null;

            if (UserInfo.IsSuperUser || UserInfo.IsInRole(PortalSettings.AdministratorRoleName) || ModulePermissionController.HasModulePermission(ActiveModule.ModulePermissions, "Edit"))
            {
                response = new ServiceResponse<string>() { Content = Globals.RESPONSE_SUCCESS };
            }
            else
            {
                response = new ServiceResponse<string>() { Content = Globals.RESPONSE_FAILURE };
            }

            return Request.CreateResponse(HttpStatusCode.OK, response.ObjectToJson());
        }

        #region Private Helper Methods

        private bool ExampleHasUpdates(ref ExampleInfo originalExample, ref ExampleInfo newExample)
        {
            var updatesToProcess = false;

            if (!string.Equals(newExample.Title, originalExample.Title))
            {
                originalExample.Title = newExample.Title;
                updatesToProcess = true;
            }

            if (!string.Equals(newExample.Description, originalExample.Description))
            {
                originalExample.Description = newExample.Description;
                updatesToProcess = true;
            }

            if (newExample.ModuleId != originalExample.ModuleId)
            {
                originalExample.ModuleId = newExample.ModuleId;
                updatesToProcess = true;
            }

            return updatesToProcess;
        }

        #endregion
    }
}