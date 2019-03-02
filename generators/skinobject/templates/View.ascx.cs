
using DotNetNuke.Services.Exceptions;
using System;
using <%= fullNamespace %>.Components;

namespace <%= fullNamespace %>
{
    public partial class View : <%= extensionName %>ModuleBase
    {

        protected void Page_Load(object sender, EventArgs e)
        {
            try
            {
               // do something
            }
            catch (Exception exc) //Module failed to load
            {
                Exceptions.ProcessModuleLoadException(this, exc);
            }
        }

    }
}