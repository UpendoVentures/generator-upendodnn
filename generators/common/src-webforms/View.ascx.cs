
using DotNetNuke.Entities.Modules;
using DotNetNuke.Entities.Modules.Actions;
using DotNetNuke.Services.Exceptions;
using System;
using System.Web.UI;
using <%= fullNamespace %>.Components;

namespace <%= fullNamespace %>
{
    public partial class View : <%= extensionName %>ModuleBase, IActionable
    {
        #region Event Handlers

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
                if (!Page.IsPostBack)
                {
                    BindModule();
                }
            }
            catch (Exception exc)
            {
                // Module failed to load
                Exceptions.ProcessModuleLoadException(this, exc, IsEditable);
            }
        }

        #endregion

        #region Private Helper Methods

        private void BindModule()
        {
            LocalizeModule();
			
			
        }
        
        private void LocalizeModule()
        {
            // do nothing
        }

        #endregion

        #region IActionable Implementation

        public ModuleActionCollection ModuleActions
        {
            get
            {
                var actions = new ModuleActionCollection
                {
                    {
                        GetNextActionID(), 
						GetLocalizedString("View.MenuItem.Title"), string.Empty,
                        string.Empty,
                        string.Empty, EditUrl(), false, DotNetNuke.Security.SecurityAccessLevel.Edit, true, false
                    }
                };
                return actions;
            }
        }

        #endregion
    }
}