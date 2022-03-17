namespace <%= fullNamespace %>.Components
{
    using System;
    using System.Globalization;

    using DotNetNuke.Common.Utilities;
    using DotNetNuke.Entities.Controllers;
    using DotNetNuke.Entities.Portals;
    using DotNetNuke.Services.Authentication;

    /// <summary>
    /// The Config class provides a central area for management of Module Configuration Settings.
    /// </summary>
    [Serializable]
    public class AuthConfigBase: AuthenticationConfigBase
    {
        private const string _cacheKey = "Authentication";

        /// <summary>
        /// Initializes a new instance of the <see cref="OAuthConfigBase"/> class.
        /// </summary>
        /// <param name="service"></param>
        /// <param name="portalId"></param>
        protected AuthConfigBase(string service, int portalId)
            : base(portalId)
        {
            this.Service = service;

            if (this.HostConfig)
            {
                this.Enabled = HostController.Instance.GetBoolean(this.Service + "_Enabled", false);
            }
            else
            {
                this.Enabled = PortalController.GetPortalSettingAsBoolean(this.Service + "_Enabled", portalId, false);
            }
        }

        public bool Enabled { get; set; }

        public bool HostConfig { get; set; }

        protected string Service { get; set; }

        public static void ClearConfig(string service, int portalId)
        {
            DataCache.RemoveCache(GetCacheKey(service, portalId));
        }

        public static AuthConfigBase GetConfig(string service, int portalId)
        {
            string key = GetCacheKey(service, portalId);
            var config = (AuthConfigBase)DataCache.GetCache(key);
            if (config == null)
            {
                config = new AuthConfigBase(service, portalId);
                DataCache.SetCache(key, config);
            }

            return config;
        }

        public static void UpdateConfig(AuthConfigBase config)
        {
            if (config.HostConfig)
            {
                HostController.Instance.Update(config.Service + "_Enabled", config.Enabled.ToString(CultureInfo.InvariantCulture), true);
                PortalController.DeletePortalSetting(config.PortalID, config.Service + "_Enabled");
            }
            else
            {
                PortalController.UpdatePortalSetting(config.PortalID, config.Service + "_Enabled", config.Enabled.ToString(CultureInfo.InvariantCulture));
            }

            ClearConfig(config.Service, config.PortalID);
        }

        private static string GetCacheKey(string service, int portalId)
        {
            return _cacheKey + "." + service + "_" + portalId;
        }
    }
}