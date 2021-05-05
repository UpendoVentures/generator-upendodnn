using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.SqlServer;
using System.Linq;
using System.Web;
using <%= fullNamespace %>.Components;

namespace <%= fullNamespace %>.Data
{
    public class DnnDbConfiguration : DbConfiguration
    {
        public DnnDbConfiguration()
        {
            SetExecutionStrategy("System.Data.SqlClient", () => new SqlAzureExecutionStrategy());
            SetDefaultConnectionFactory(new SqlConnectionFactory(DataProviderHelper.ConnectionString));
        }
    }
}