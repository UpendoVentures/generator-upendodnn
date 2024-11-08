using DotNetNuke.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using <%= fullNamespace %>.Services;
using <%= fullNamespace %>.Services.Interfaces;

namespace <%= fullNamespace %>
{
    public class Startup : IDnnStartup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddScoped<IResxService, ResxService>();
        }
    }
}