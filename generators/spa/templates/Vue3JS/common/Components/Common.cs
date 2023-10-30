using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DotNetNuke.ComponentModel.DataAnnotations;
using Newtonsoft.Json.Linq;

namespace <%= fullNamespace %>.Components
{
    /// <summary>
    /// A collection of common utility methods.
    /// </summary>
    public static class Common
    {
        /// <summary>
        /// Checks whether the given string is valid JSON.
        /// </summary>
        /// <param name="s">The input string to check for JSON validity.</param>
        /// <returns><c>true</c> if the string is valid JSON; otherwise, <c>false</c>.</returns>
        public static bool IsJson(this string s)
        {
            try
            {
                var dummy = JToken.Parse(s);
                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Gets the table name associated with a specific type in the DotNetNuke data model.
        /// </summary>
        /// <typeparam name="T">The type for which to retrieve the table name.</typeparam>
        /// <returns>The table name if available; otherwise, <c>null</c>.</returns>
        public static string GetTableName<T>()
        {
            var tableNameAttribute = typeof(T).GetCustomAttributes(typeof(TableNameAttribute), true).FirstOrDefault();
            if (tableNameAttribute != null && tableNameAttribute is TableNameAttribute dnAttribute)
            {
                return dnAttribute.TableName;
            }
            return null;
        }
    }
}
