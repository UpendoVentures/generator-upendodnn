using DotNetNuke.UI.Skins; 

namespace <%= fullNamespace %>.Components
{
    public class <%= extensionName %>ModuleBase : SkinObjectBase 
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