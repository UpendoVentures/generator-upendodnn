
using System;
using System.Text;
using System.Net;
using System.IO;
using <%= fullNamespace %>.Components;
using <%= fullNamespace %>.Services;

namespace <%= fullNamespace %>.Tests
{
    public class ServiceHelper
    {
        public static T GetRequest<T>(string uri)
            where T : class, new()
        {
            var result = SendGet<T>(uri);
            return result;
        }

        public static T PostRequest<T>(string uri, string data)
            where T : class, new()
        {
            var result = SendWithData<T>(uri, "POST", data);
            return result;
        }

        public static T PutRequest<T>(string uri, string data)
            where T : class, new()
        {
            var result = SendWithData<T>(uri, "PUT", data);
            return result;
        }

        public static T DeleteRequest<T>(string uri, string data)
            where T : class, new()
        {
            var result = SendWithData<T>(uri, "DELETE", data);
            return result;
        }

        private const int DefaultTimeout = 100000;

        private static T SendGet<T>(string uri)
            where T : class, new()
        {
            try
            {
                var response = SendRequest(uri, "GET", null);
                var result = JsonHelper.ObjectFromJson<T>(response);

                return result;
            }
            catch (Exception ex)
            {
                var result = new T();
                var apiResponse = result as IServiceResponse;

                if (apiResponse != null)
                {
                    apiResponse.Errors.Add(new ServiceError("EXCEPTION", ex.Message + " | " + ex.StackTrace));
                }

                return result;
            }
        }

        private static T SendWithData<T>(string uri, string method, string data)
            where T : class, new()
        {
            try
            {
                var response = SendRequest(uri, method, data);
                var result = JsonHelper.ObjectFromJson<T>(response);
                return result;
            }
            catch (Exception ex)
            {
                var result = new T();
                var apiResponse = result as IServiceResponse;

                if (apiResponse != null)
                {
                    apiResponse.Errors.Add(new ServiceError("EXCEPTION", ex.Message + " | " + ex.StackTrace));
                }

                return result;
            }
        }

        private static string SendRequest(string serviceUrl, string method, string data, WebProxy proxy = null, int timeout = DefaultTimeout)
        {
            WebResponse objResp;
            WebRequest objReq;
            var strResp = string.Empty;
            byte[] byteReq;

            try
            {
                byteReq = data == null ? null : Encoding.UTF8.GetBytes(data);
                objReq = WebRequest.Create(serviceUrl);
                objReq.Method = method.ToUpperInvariant();

                if (byteReq != null)
                {
                    objReq.ContentLength = byteReq.Length;
                    objReq.ContentType = "application/x-www-form-urlencoded";
                }

                objReq.Timeout = timeout;
                
                if (proxy != null)
                {
                    objReq.Proxy = proxy;
                }

                if (byteReq != null)
                {
                    var OutStream = objReq.GetRequestStream();

                    OutStream.Write(byteReq, 0, byteReq.Length);
                    OutStream.Close();
                }
                
                objResp = objReq.GetResponse();
                
                var sr = new StreamReader(objResp.GetResponseStream(), Encoding.UTF8, true);
                
                strResp += sr.ReadToEnd();
                sr.Close();
            }
            catch (Exception ex)
            {
                throw new ArgumentException("Error SendRequest: " + ex.Message + " " + ex.Source);
            }

            return strResp;
        }
    }
}