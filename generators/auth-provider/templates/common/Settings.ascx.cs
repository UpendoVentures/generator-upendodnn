namespace <%= fullNamespace %>
{
    using System;

    using DotNetNuke.Services.Authentication;
    using DotNetNuke.Services.Exceptions;
    using <%= fullNamespace %>.Components;

    public partial class Settings : AuthenticationSettingsBase
    {
        protected string AuthSystemApplicationName
        {
            get { return Const.AUTH_SYSTEM_TYPE; }
        }

        public override void UpdateSettings()
        {
            if (this.SettingsEditor.IsValid && this.SettingsEditor.IsDirty)
            {
                var config = (AuthConfigBase)SettingsEditor.DataSource;
                AuthConfigBase.UpdateConfig(config);
            }
        }

        protected override void OnLoad(EventArgs e)
        {
            base.OnLoad(e);

            try
            {
                AuthConfigBase config = AuthConfigBase.GetConfig(AuthSystemApplicationName, this.PortalId);
                this.SettingsEditor.DataSource = config;
                this.SettingsEditor.DataBind();
            }
            catch (Exception exc)
            {
                Exceptions.ProcessModuleLoadException(this, exc);
            }
        }
    }
}