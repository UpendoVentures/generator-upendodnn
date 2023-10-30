using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using DotNetNuke.Web.Api;
using <%= fullNamespace %>.Data;
using Newtonsoft.Json.Linq;

namespace <%= fullNamespace %>.Components.BaseClasses
{
    /// <summary>
    /// Base class for API controllers within the <%= friendlyName %> module.
    /// </summary>
    public class ApiControllerBase : DnnApiController
    {
        /// <summary>
        /// Parses and retrieves JSON content from the request body.
        /// </summary>
        /// <typeparam name="T">The type of JSON token to return (e.g., JToken, JArray, or JObject).</typeparam>
        /// <returns>The parsed JSON content as the specified type.</returns>
        public T ContentJ<T>() where T : JToken
        {
            // Get content from the request into a string
            HttpContent requestContent = Request.Content;
            string jsonContent = requestContent.ReadAsStringAsync().Result;

            // Check if it's valid JSON
            if (!jsonContent.IsJson())
            {
                throw new Exception("Request body is not valid JSON");
            }

            // Parse the JSON string
            var jtoken = JToken.Parse(jsonContent);

            // Check if it's the correct type
            if (typeof(T) == typeof(JToken) ||
                (jtoken.Type == JTokenType.Array && typeof(T) == typeof(JArray)) ||
                (jtoken.Type == JTokenType.Object && typeof(T) == typeof(JObject)))
            {
                // We can safely return it
                return (T)jtoken;
            }
            else
            {
                throw new Exception($"Request body is not of type {typeof(T).Name}");
            }
        }
    }
}