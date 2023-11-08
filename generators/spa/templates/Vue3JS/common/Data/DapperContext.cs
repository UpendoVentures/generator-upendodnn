
using System.Data.SqlClient;
using System.Data;

namespace <%= fullNamespace %>.Data
{
    public class DapperContext
    {
        private readonly string _connectionString;
        public DapperContext()
        {
            _connectionString = DotNetNuke.Common.Utilities.Config.GetConnectionString();
        }
        public IDbConnection CreateConnection()
            => new SqlConnection(_connectionString);
    }
}
