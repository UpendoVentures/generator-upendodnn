using <%= fullNamespace %>.Constants;
using <%= fullNamespace %>.Data;
using Dapper;
using DotNetNuke.Entities.Users;
using DotNetNuke.Instrumentation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace <%= fullNamespace %>.Repository
{
    public class ItemsRepository : GenericRepository<Item>
    {
        private readonly IDbConnection _connection;
        private readonly ILog _logger;

        public ItemsRepository(DapperContext context) : base(context)
        {
            _connection = context.CreateConnection();
            _logger = LoggerSource.Instance.GetLogger(GetType());
        }

        public async Task<IEnumerable<Item>> GetAllAsync()
        {
            IEnumerable<Item> result = null;
            try
            {
                string tableName = GetTableName();
                string query = $"SELECT * FROM {tableName}";

                using (IDbConnection dbConnection = new SqlConnection(_connection.ConnectionString))
                {
                    dbConnection.Open();
                    var data = dbConnection.Query<Item>(query);
                    dbConnection.Close();
                    return data.ToList();
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return result;
        }
        public async Task<Item> GetByItemId(int ItemId)
        {
            Item result = new Item();
            try
            {
                string tableName = GetTableName();
                string keyColumn = ModuleConstants.ITEM_ID_COLUMN;
                string query = $"SELECT * FROM {tableName} WHERE {keyColumn}=@{keyColumn}";
                using (IDbConnection dbConnection = new SqlConnection(_connection.ConnectionString))
                {
                    result = dbConnection.QueryFirstOrDefault<Item>(query, new { ItemId });
                    return result;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }
            return result;
        }

        public async Task<Item> CreateAsync(Item item)
        {
            var currentUser = UserController.Instance.GetCurrentUserInfo();

            using (IDbConnection dbConnection = new SqlConnection(_connection.ConnectionString))
            {
                try
                {
                    Item i = new Item
                    {
                        ItemName = item.ItemName,
                        ItemDescription = item.ItemDescription,
                        AssignedUserId = currentUser.UserID,
                        ModuleId = item.ModuleId,
                        CreatedByUserId = currentUser.UserID,
                        LastModifiedByUserId = currentUser.UserID,
                        CreatedOnDate = DateTime.UtcNow,
                        LastModifiedOnDate = DateTime.UtcNow
                    };
                    string tableName = GetTableName();
                    string insertQuery = $"INSERT INTO {tableName} " +
                     $"({ModuleConstants.ITEM_NAME_COLUMN}, {ModuleConstants.ITEM_DESCRIPTION_COLUMN}, " +
                     $"{ModuleConstants.ASSIGNED_USER_ID_COLUMN}, {ModuleConstants.MODULE_ID_COLUMN}, " +
                     $"{ModuleConstants.LAST_MODIFIED_BY_USER_ID_COLUMN}, {ModuleConstants.LAST_MODIFIED_ON_DATE}, " +
                     $"{ModuleConstants.CREATED_BY_USER_ID_COLUMN}, {ModuleConstants.CREATED_ON_DATE}) " +
                     "VALUES " +
                     $"(@{ModuleConstants.ITEM_NAME_COLUMN}, @{ModuleConstants.ITEM_DESCRIPTION_COLUMN}, " +
                     $"@{ModuleConstants.ASSIGNED_USER_ID_COLUMN}, @{ModuleConstants.MODULE_ID_COLUMN}, " +
                     $"@{ModuleConstants.LAST_MODIFIED_BY_USER_ID_COLUMN}, @{ModuleConstants.LAST_MODIFIED_ON_DATE}, " +
                     $"@{ModuleConstants.CREATED_BY_USER_ID_COLUMN}, @{ModuleConstants.CREATED_ON_DATE})";

                    int rowsEffected = await dbConnection.ExecuteAsync(insertQuery, i);
                    return i;
                }
                catch (Exception ex)
                {
                    _logger.Error(ex);
                    Item i = new Item { };
                    return i;
                }
            }
        }
        public async Task<bool> UpdateAsync(Item item)
        {
            try
            {
                // Database connection
                using (IDbConnection dbConnection = new SqlConnection(_connection.ConnectionString))
                {
                    // Define the update SQL query
                    string updateQuery = $"UPDATE {GetTableName()} " +
                                        $"SET {ModuleConstants.ITEM_NAME_COLUMN} = @{ModuleConstants.ITEM_NAME_COLUMN}, " +
                                        $"{ModuleConstants.ITEM_DESCRIPTION_COLUMN} = @{ModuleConstants.ITEM_DESCRIPTION_COLUMN}, " +
                                        $"{ModuleConstants.ASSIGNED_USER_ID_COLUMN} = @{ModuleConstants.ASSIGNED_USER_ID_COLUMN}, " +
                                        $"{ModuleConstants.MODULE_ID_COLUMN} = @{ModuleConstants.MODULE_ID_COLUMN}, " +
                                        $"{ModuleConstants.LAST_MODIFIED_BY_USER_ID_COLUMN} = @{ModuleConstants.LAST_MODIFIED_BY_USER_ID_COLUMN}, " +
                                        $"{ModuleConstants.LAST_MODIFIED_ON_DATE} = @{ModuleConstants.LAST_MODIFIED_ON_DATE} " +
                                        $"WHERE {ModuleConstants.ITEM_ID_COLUMN} = @{ModuleConstants.ITEM_ID_COLUMN}";

                    // Execute the update query
                    int rowsEffected = await dbConnection.ExecuteAsync(updateQuery, item);

                    // Return true if at least one row is affected by the update, otherwise, return false.
                    return rowsEffected > 0;
                }
            }
            catch (Exception ex)
            {
                // Error handling, such as error logging
                _logger.Error(ex);
                return false;
            }
        }

        public async Task<bool> DeleteAsync(int ItemId)
        {
            try
            {
                string tableName = GetTableName();
                string keyColumn = ModuleConstants.ITEM_ID_COLUMN;
                string query = $"DELETE FROM {tableName} WHERE {keyColumn}=@{keyColumn}";
                using (IDbConnection dbConnection = new SqlConnection(_connection.ConnectionString))
                {
                    int rowsAffected = await dbConnection.ExecuteAsync(query, new { ItemId = ItemId });
                    return rowsAffected > 0 ? true : false;
                }
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
                return false;
            }
        }
    }
}