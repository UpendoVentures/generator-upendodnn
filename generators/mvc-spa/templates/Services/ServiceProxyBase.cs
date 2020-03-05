
namespace <%= fullNamespace %>.Services
{
    public class ServiceProxyBase
    {
        protected string baseUri = string.Empty;
        protected string fullApiUri = string.Empty;

        protected string Enc(string input)
        {
            return input.Replace("/", "%2F");
        }
    }
}