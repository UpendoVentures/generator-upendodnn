using DotNetNuke.UI.Skins; 

namespace <%= fullNamespace %>  
{
    public class <%= moduleName %>ModuleBase : SkinObjectBase 
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