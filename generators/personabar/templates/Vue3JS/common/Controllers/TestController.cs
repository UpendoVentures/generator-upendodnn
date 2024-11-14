using DotNetNuke.Entities.Portals;
using DotNetNuke.Entities.Users;
using DotNetNuke.Instrumentation;
using DotNetNuke.Web.Api;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using <%= fullNamespace %>.Constants;
using <%= fullNamespace %>.Services.Interfaces;
using <%= fullNamespace %>.ViewModels;

namespace <%= fullNamespace %>.Controllers
{
    [DnnAuthorize]
    public class TestController: DnnApiController
    {
        private readonly Dictionary<string, string> _portalSettings;
        private readonly int _portalId;
        private readonly IResxService _resx;
        private readonly ILog _logger;


        public TestController(IResxService resx)
        {
            _portalId = PortalSettings.Current.PortalId;
            _portalSettings = PortalController.Instance.GetPortalSettings(_portalId);
            _resx = resx;
            _logger = _logger = LoggerSource.Instance.GetLogger(typeof(TestController));
        }

        [HttpGet]
        public HttpResponseMessage GetPersonaBarTestSetting()
        {
            try
            {
                if (!currentUserIsAdmin())
                    return CreateForbiddenResponse();

                var value = string.Empty;
                var settingValue = _portalSettings.TryGetValue(ModuleConstants.PersonaBarTestSetting, out value);
                return Request.CreateResponse(HttpStatusCode.OK, value);
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
                return CreateErrorResponse();
            }
        }

        [HttpPost]
        public HttpResponseMessage SetPersonaBarTestSetting([FromBody] TestSettingViewModel model)
        {
            try
            {
                if (!currentUserIsAdmin())
                    return CreateForbiddenResponse();

                PortalController.UpdatePortalSetting(_portalId, ModuleConstants.PersonaBarTestSetting, model.TestSetting);
                return Request.CreateResponse(HttpStatusCode.OK, true);
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
                return CreateErrorResponse();
            }
        }

        private bool currentUserIsAdmin()
        {
            return UserController.Instance.GetCurrentUserInfo().IsAdmin;
        }

        private HttpResponseMessage CreateForbiddenResponse()
        {
            return Request.CreateResponse(HttpStatusCode.Forbidden, _resx.GetLocalization(ApiError_Key.ForbiddenMessage));
        }

        private HttpResponseMessage CreateErrorResponse()
        {
            return Request.CreateResponse(HttpStatusCode.InternalServerError, _resx.GetLocalization(ApiError_Key.InternalServerError));
        }

    }
}