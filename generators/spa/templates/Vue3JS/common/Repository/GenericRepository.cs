using Dapper;
using DotNetNuke.Instrumentation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using <%= fullNamespace %>.Constants;
using static Dapper.SqlMapper;
using <%= fullNamespace %>.Data;
using <%= fullNamespace %>.Repository.Contract;

namespace <%= fullNamespace %>.Repository
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly IDbConnection _connection;
        private readonly ILog _logger;

        public GenericRepository(DapperContext context)
        {
            _connection = context.CreateConnection();
            _logger = LoggerSource.Instance.GetLogger(GetType());
        }

        /// <summary>
        /// Adds a new entity of type T to the database.
        /// </summary>
        /// <param name="entity">The entity to add to the database.</param>
        /// <returns>
        ///   <c>true</c> if the entity was successfully added; otherwise, <c>false</c>.
        /// </returns>
        public async Task<bool> AddAsync(T entity)
        {
            int rowsEffected = 0;
            try
            {
                // Get the name of the table associated with the entity type.
                string tableName = GetTableName();

                // Get the names of columns and properties, excluding the primary key.
                string columns = GetColumns(excludeKey: true);
                string properties = GetPropertyNames(excludeKey: true);

                // Create an SQL query to insert the entity into the table.
                string query = $"INSERT INTO {tableName} ({columns}) VALUES ({properties})";

                // Execute the insert query asynchronously, specifying the entity as parameters.
                rowsEffected = await _connection.ExecuteAsync(query, entity);
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }

            // Return true if at least one row is affected by the insert; otherwise, return false.
            return rowsEffected > 0 ? true : false;
        }


        /// <summary>
        /// Deletes an entity of type T from the database based on its primary key.
        /// </summary>
        /// <param name="entity">The entity to delete from the database.</param>
        /// <returns>
        ///   <c>true</c> if the entity was successfully deleted; otherwise, <c>false</c>.
        /// </returns>
        public async Task<bool> DeleteAsync(T entity)
        {
            int rowsEffected = 0;
            try
            {
                // Get the name of the table associated with the entity type.
                string tableName = GetTableName();

                // Get the name of the primary key column and property.
                string keyColumn = GetKeyColumnName();
                string keyProperty = GetKeyPropertyName();

                // Create an SQL query to delete the entity based on its primary key.
                string query = $"DELETE FROM {tableName} WHERE {keyColumn} = @{keyProperty}";

                // Execute the delete query asynchronously, specifying the entity as parameters.
                rowsEffected = await _connection.ExecuteAsync(query, entity);
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }

            // Return true if at least one row is affected by the delete; otherwise, return false.
            return rowsEffected > 0 ? true : false;
        }


        /// <summary>
        /// Retrieves all entities of type T from the database.
        /// </summary>
        /// <returns>
        ///   A collection of all entities of type T found in the database.
        /// </returns>
        public async Task<IEnumerable<T>> GetAllAsync()
        {
            IEnumerable<T> result = null;
            try
            {
                // Get the name of the table associated with the entity type.
                string tableName = GetTableName();

                // Construct an SQL query to select all records from the table.
                string query = $"SELECT * FROM {tableName}";

                // Execute the query asynchronously and retrieve the results into a collection.
                result = await _connection.QueryAsync<T>(query);
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }

            // Return a collection containing all entities of type T found in the database.
            return result;
        }


        /// <summary>
        /// Retrieves an entity of type T from the database by its unique identifier.
        /// </summary>
        /// <param name="Id">The unique identifier of the entity to retrieve.</param>
        /// <returns>
        ///   The entity of type T with the specified unique identifier, or null if not found.
        /// </returns>
        public async Task<T> GetByIdAsync(int Id)
        {
            IEnumerable<T> result = null;
            try
            {
                // Get the name of the table associated with the entity type.
                string tableName = GetTableName();

                // Get the name of the primary key column for the entity.
                string keyColumn = GetKeyColumnName();

                // Construct an SQL query to select the entity by its primary key.
                string query = $"SELECT * FROM {tableName} WHERE {keyColumn} = @Id";

                // Execute the query asynchronously with the provided Id parameter.
                result = await _connection.QueryAsync<T>(query, new { Id });
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }

            // Return the first entity found with the specified Id, or null if not found.
            return result.FirstOrDefault();
        }


        /// <summary>
        /// Updates an entity of type T in the database with the provided data.
        /// </summary>
        /// <param name="entity">The entity to update in the database.</param>
        /// <returns>
        ///   A boolean indicating whether the update operation was successful (true) or not (false).
        /// </returns>
        public async Task<bool> UpdateAsync(T entity)
        {
            int rowsEffected = 0;
            try
            {
                // Get the name of the table associated with the entity type.
                string tableName = GetTableName();

                // Get the name of the primary key column for the entity.
                string keyColumn = GetKeyColumnName();

                // Get the name of the primary key property for the entity.
                string keyProperty = GetKeyPropertyName();

                // Initialize a StringBuilder to construct the SQL update query.
                StringBuilder query = new StringBuilder();
                query.Append($"UPDATE {tableName} SET ");

                // Iterate through the entity properties.
                foreach (var property in GetProperties(true))
                {
                    var columnAttr = property.GetCustomAttribute<ColumnAttribute>();

                    string propertyName = property.Name;
                    string columnName = columnAttr.Name;

                    // Append each property assignment in the update query.
                    query.Append($"{columnName} = @{propertyName},");
                }

                // Remove the trailing comma from the query.
                query.Remove(query.Length - 1, 1);

                // Append the WHERE clause to identify the entity to update by its primary key.
                query.Append($" WHERE {keyColumn} = @{keyProperty}");

                // Execute the update query asynchronously with the provided entity data.
                rowsEffected = await _connection.ExecuteAsync(query.ToString(), entity);
            }
            catch (Exception ex)
            {
                _logger.Error(ex);
            }

            // Return true if at least one row is affected by the update; otherwise, return false.
            return rowsEffected > 0 ? true : false;
        }


        /// <summary>
        /// Gets the name of the database table associated with the entity type T.
        /// </summary>
        /// <returns>
        ///   The name of the database table for the entity type T.
        /// </returns>
        public string GetTableName()
        {
            string tableName = string.Empty;
            var type = typeof(T);

            // Attempt to retrieve the TableAttribute for the entity type.
            var tableAttr = type.GetCustomAttribute<TableAttribute>();

            if (tableAttr != null)
            {
                // If a TableAttribute is found, use its specified table name.
                tableName = tableAttr.Name;
                return tableName;
            }

            // If no TableAttribute is found, generate a table name using a naming convention.
            // The convention is based on appending "_s" to the entity type's name, optionally with a prefix.
            return $"{ModuleConstants.DBTABLE_PREFIX}_{type.Name}" + "s";
        }

        /// <summary>
        /// Gets the name of the primary key column associated with the entity type T.
        /// </summary>
        /// <returns>
        ///   The name of the primary key column for the entity type T, or null if not found.
        /// </returns>
        public static string GetKeyColumnName()
        {
            // Retrieve all properties of the entity type T.
            PropertyInfo[] properties = typeof(T).GetProperties();

            foreach (PropertyInfo property in properties)
            {
                // Check if the property has a KeyAttribute applied.
                object[] keyAttributes = property.GetCustomAttributes(typeof(KeyAttribute), true);

                if (keyAttributes != null && keyAttributes.Length > 0)
                {
                    // If the property has a KeyAttribute, check if it also has a ColumnAttribute applied.
                    object[] columnAttributes = property.GetCustomAttributes(typeof(ColumnAttribute), true);

                    if (columnAttributes != null && columnAttributes.Length > 0)
                    {
                        // If a ColumnAttribute is found, retrieve its Name property as the key column name.
                        ColumnAttribute columnAttribute = (ColumnAttribute)columnAttributes[0];
                        return columnAttribute.Name;
                    }
                    else
                    {
                        // If no ColumnAttribute is found, use the property name as the key column name.
                        return property.Name;
                    }
                }
            }

            // Return null if no property with a KeyAttribute is found.
            return null;
        }



        /// <summary>
        /// Gets a comma-separated string of column names for the entity type T.
        /// </summary>
        /// <param name="excludeKey">Whether to exclude columns marked as primary keys.</param>
        /// <returns>
        ///   A string containing comma-separated column names for the entity type T.
        /// </returns>
        private string GetColumns(bool excludeKey = false)
        {
            var type = typeof(T);

            // Use LINQ to query and construct the column names.
            var columns = string.Join(", ", type.GetProperties()
                .Where(p => !excludeKey || !p.IsDefined(typeof(KeyAttribute))) // Optionally exclude primary key columns.
                .Select(p =>
                {
                    var columnAttr = p.GetCustomAttribute<ColumnAttribute>();
                    return columnAttr != null ? columnAttr.Name : p.Name; // Use custom column name if specified via ColumnAttribute.
                }));

            return columns;
        }


        /// <summary>
        /// Gets a comma-separated string of parameter names for the entity type T.
        /// </summary>
        /// <param name="excludeKey">Whether to exclude properties marked as primary keys.</param>
        /// <returns>
        ///   A string containing comma-separated parameter names for the entity type T.
        /// </returns>
        protected string GetPropertyNames(bool excludeKey = false)
        {
            var properties = typeof(T).GetProperties()
                .Where(p => !excludeKey || p.GetCustomAttribute<KeyAttribute>() == null);

            var values = string.Join(", ", properties.Select(p =>
            {
                return $"@{p.Name}";
            }));

            return values;
        }


        /// <summary>
        /// Gets a collection of PropertyInfo objects representing the properties of the entity type T.
        /// </summary>
        /// <param name="excludeKey">Whether to exclude properties marked as primary keys.</param>
        /// <returns>
        ///   A collection of PropertyInfo objects representing the properties of the entity type T.
        /// </returns>
        protected IEnumerable<PropertyInfo> GetProperties(bool excludeKey = false)
        {
            var properties = typeof(T).GetProperties()
                .Where(p => !excludeKey || p.GetCustomAttribute<KeyAttribute>() == null);

            return properties;
        }


        /// <summary>
        /// Gets the name of the property that is marked as the primary key for the entity type T.
        /// </summary>
        /// <returns>
        ///   The name of the primary key property or null if no primary key is defined.
        /// </returns>
        protected string GetKeyPropertyName()
        {
            var properties = typeof(T).GetProperties()
                .Where(p => p.GetCustomAttribute<KeyAttribute>() != null);

            if (properties.Any())
            {
                return properties.FirstOrDefault().Name;
            }

            return null;
        }

    }
}
