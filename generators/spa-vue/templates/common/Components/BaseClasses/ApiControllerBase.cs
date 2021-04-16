using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DotNetNuke.Web.Api;
using <%= fullNamespace %>.Data;

namespace <%= fullNamespace %>.Components.BaseClasses
{
    public class ApiControllerBase : DnnApiController
    {
        private const string DBCONTEXT_KEY = "<%= extensionName %>Context_Instance";

        public <%= extensionName %>Context DbCtx
        {
            get
            {
                return GetContext();
            }
        }

        /// <summary>
        /// Returns a DbContext object for use with this request. Instanciates a new DbContext when requested in the parameter. When using createNewInstance, you should always dispose your DbContext yourself.
        /// </summary>
        /// <param name="createNewInstance"></param>
        /// <returns></returns>
        protected <%= extensionName %>Context GetContext(bool createNewInstance = false)
        {
            // if a new instance is requested: return one
            if (createNewInstance) return new <%= extensionName %>Context();

            // get a reference to the HttpContext
            var ctx = Request.Properties["MS_HttpContext"] as HttpContextWrapper;

            <%= extensionName %>Context retval = null;
            // se if we have one in the HttpContext already
            if (ctx.Items[DBCONTEXT_KEY] == null)
            {
                retval = new <%= extensionName %>Context();
                // store in HttpContext
                ctx.Items[DBCONTEXT_KEY] = retval;
            }
            else
            {
                // get from HttpContext
                retval = (<%= extensionName %>Context)ctx.Items[DBCONTEXT_KEY];
            }

            return retval;
        }

        protected override void Dispose(bool disposing)
        {
            // get a reference to the HttpContext
            var ctx = Request.Properties["MS_HttpContext"] as HttpContextWrapper;

            // dispose of stored DbContext
            if (ctx.Items[DBCONTEXT_KEY] != null)
            {
                var dbctx = (<%= extensionName %>Context)ctx.Items[DBCONTEXT_KEY];
                dbctx.Dispose();
            }

            base.Dispose(disposing);
        }
    }
}