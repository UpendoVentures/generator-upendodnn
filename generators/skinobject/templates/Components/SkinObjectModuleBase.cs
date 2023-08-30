using DotNetNuke.UI.Skins; 

namespace <%= fullNamespace %>.Components
{
    public class <%= friendlyName %>ModuleBase : SkinObjectBase 
	{
        public string ControlPath 
		{
            get 
			{
                return string.Concat(TemplateSourceDirectory, "/"); 
            }
        }
    }
}