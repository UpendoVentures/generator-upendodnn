namespace <%= fullNamespace %>.Constants
{
    public class ModuleConstants
    {
        /// <summary>
        /// The root path for .resx files.
        /// </summary>
        public const string ResxPartialRoot = "~\\DesktopModules\\Admin\\Dnn.PersonaBar\\Modules\\<%= fullNamespace %>\\App_LocalResources\\";

        /// <summary>
        /// The attribute name used in XML data nodes.
        /// </summary>
        public const string DataNodeAttributesName = "name";

        /// <summary>
        /// The path to the root data in XML.
        /// </summary>
        public const string RootData = "/root/data";

        /// <summary>
        /// The text suffix for keys ending with a period.
        /// </summary>
        public const string PointText = ".Text";

        public const string PersonaBarTestSetting = "PersonaBarTestSetting";

        public const string RESX_NAME = "<%= friendlyName %>";
    }

    public class ApiError_Key
    {
        public const string ForbiddenMessage = "ForbiddenMessage";
        public const string InternalServerError = "InternalServerError";
    }
}