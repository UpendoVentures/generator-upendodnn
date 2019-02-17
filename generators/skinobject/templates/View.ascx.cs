
using System;
using DotNetNuke.Services.Exceptions;

namespace <%= fullNamespace %>
{
    public partial class View : SkinObjectModuleBase
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