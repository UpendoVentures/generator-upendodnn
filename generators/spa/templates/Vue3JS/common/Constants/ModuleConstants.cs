using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace <%= fullNamespace %>.Constants
{
    /// <summary>
    /// Constants used within the module.
    /// </summary>
    public class ModuleConstants
    {
        /// <summary>
        /// The root path for .resx files.
        /// </summary>
        public const string ResxPartialRoot = "~\\DesktopModules\\<%= friendlyName %>\\App_LocalResources\\";

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
        public const string PointText = ".text";

        /// <summary>
        /// The name of the module folder.
        /// </summary>
        public const string ModuleFolderName = "Company.Modules.<%= friendlyName %>";

        /// <summary>
        /// The name of the supported module.
        /// </summary>
        public const string SupportedModules = "<%= friendlyName %>";

        /// <summary>
        /// The text used for editing.
        /// </summary>
        public const string EditText = "EDIT";

        /// <summary>
        /// The prefix used for database tables.
        /// </summary>
        public const string DBTABLE_PREFIX = "<%= friendlyName %>";

        /// <summary>
        /// The name of the column representing the item ID.
        /// </summary>
        public const string ITEM_ID_COLUMN = "ItemId";

        /// <summary>
        /// The name of the column representing the item name.
        /// </summary>
        public const string ITEM_NAME_COLUMN = "ItemName";

        /// <summary>
        /// The name of the column representing the item description.
        /// </summary>
        public const string ITEM_DESCRIPTION_COLUMN = "ItemDescription";

        /// <summary>
        /// The name of the column representing the assigned user ID.
        /// </summary>
        public const string ASSIGNED_USER_ID_COLUMN = "AssignedUserId";

        /// <summary>
        /// The name of the column representing the module ID.
        /// </summary>
        public const string MODULE_ID_COLUMN = "ModuleId";

        /// <summary>
        /// The name of the column representing the last modified by user ID.
        /// </summary>
        public const string LAST_MODIFIED_BY_USER_ID_COLUMN = "LastModifiedByUserId";

        /// <summary>
        /// The name of the column representing the last modified on date.
        /// </summary>
        public const string LAST_MODIFIED_ON_DATE = "LastModifiedOnDate";

        /// <summary>
        /// The name of the column representing the created by user ID.
        /// </summary>
        public const string CREATED_BY_USER_ID_COLUMN = "CreatedByUserId";

        /// <summary>
        /// The name of the column representing the created on date.
        /// </summary>
        public const string CREATED_ON_DATE = "CreatedOnDate";
    }
}