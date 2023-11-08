using <%= fullNamespace %>.Data;
using <%= fullNamespace %>.Repository;
using <%= fullNamespace %>.Services;
using DotNetNuke.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;

namespace <%= fullNamespace %>
{
    public class Startup : IDnnStartup
    {
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddTransient<DapperContext, DapperContext>();
            services.AddScoped(typeof(ItemsRepository));
        }
    }
}
