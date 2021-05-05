    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using DotNetNuke.Data;
    using DotNetNuke.Framework.Providers;

namespace <%= fullNamespace %>.Data
{

    [DbConfigurationType("<%= fullNamespace %>.Data.DnnDbConfiguration, <%= fullNamespace %>")]
    public partial class <%= moduleName %>DataContext : DbContext
    {
        public <%= moduleName %>DataContext() : base("name=SiteSqlServer")
        {
            Database.SetInitializer<<%= moduleName %>DataContext>(null);
        }

        public virtual DbSet<Item> Items { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            string moduleQualifier = "<%= objectPrefix %>_";

            // get the dnn data provider configuration
            ProviderConfiguration pc = ProviderConfiguration.GetProviderConfiguration("data");

            // Read the configuration specific information for this provider
            Provider provider = (Provider)pc.Providers[pc.DefaultProvider];
            
            // get the objectQualifier
            String objectQualifier = provider.Attributes["objectQualifier"];
            
            // append an underscore when it's not there
            if (!string.IsNullOrEmpty(objectQualifier) && !objectQualifier.EndsWith("_"))
            {
                objectQualifier = string.Concat(objectQualifier, "_");
            }

            // map the object to the right table
            modelBuilder.Entity<Item>().ToTable($"{objectQualifier}{moduleQualifier}Items");
        }
    }
}
