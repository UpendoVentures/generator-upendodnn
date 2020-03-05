
using System.Collections.Generic;
using <%= fullNamespace %>.Components;
using <%= fullNamespace %>.Models;
using <%= fullNamespace %>.Tests;

namespace <%= fullNamespace %>.Services
{
    public class ServiceProxy : ServiceProxyBase
    {
        public ServiceProxy(string baseWebSiteUri)
        {
            baseUri = baseWebSiteUri;
            
            if (!baseUri.EndsWith("/"))
            {
                baseUri += "/";
            }

            fullApiUri = System.IO.Path.Combine(baseUri, "DesktopModules/MVC/<%= fullNamespace %>/API/Example/");
        }

        public ServiceResponse<string> CreateExample(ExampleInfo example)
        {
            var result = new ServiceResponse<string>();

            result = ServiceHelper.PostRequest<ServiceResponse<string>>(fullApiUri + "CreateExample", example.ObjectToJson());
            
            return result;   
        }

        public ServiceResponse<List<ExampleInfo>> GetExamples(int moduleId)
        {
            var result = new ServiceResponse<List<ExampleInfo>>();

            result = ServiceHelper.GetRequest<ServiceResponse<List<ExampleInfo>>>(fullApiUri + "GetExamples?moduleId=" + moduleId);

            return result;
        }

        public ServiceResponse<ExampleInfo> GetExample(int itemId)
        {
            var result = new ServiceResponse<ExampleInfo>();

            result = ServiceHelper.GetRequest<ServiceResponse<ExampleInfo>>(fullApiUri + "GetExample?itemId=" + itemId);

            return result;
        }
        
        public ServiceResponse<string> UpdateExample(ExampleInfo example)
        {
            var result = new ServiceResponse<string>();

            result = ServiceHelper.PostRequest<ServiceResponse<string>>(fullApiUri + "UpdateExample", example.ObjectToJson());

            return result;
        }

        public ServiceResponse<string> DeleteExample(int itemId)
        {
            var result = new ServiceResponse<string>();

            result = ServiceHelper.DeleteRequest<ServiceResponse<string>>(fullApiUri + "DeleteExample?itemId=" + itemId, string.Empty);

            return result;
        }
    }
}