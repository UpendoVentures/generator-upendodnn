using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DotNetNuke.Common.Utilities;
using DotNetNuke.Framework.Providers;

namespace <%= fullNamespace %>.Components
{
    public static class DataProviderHelper
    {
        private static ProviderConfiguration _dataProviderConfig = null;
        public static ProviderConfiguration DataProviderConfig
        {
            get
            {
                if (_dataProviderConfig == null)
                {
                    // get the dnn data provider configuration
                    _dataProviderConfig = ProviderConfiguration.GetProviderConfiguration("data");
                }
                return _dataProviderConfig;
            }
        }
        private static Provider _dataProvider = null;
        public static Provider DataProvider
        {
            get
            {
                if (_dataProvider == null)
                {
                    // Read the configuration specific information for this provider
                    _dataProvider = (Provider)DataProviderConfig.Providers[DataProviderConfig.DefaultProvider];
                }
                return _dataProvider;
            }
        }
        public static string ObjectQualifier
        {
            get
            {
                // get the objectQualifier
                String objectQualifier = DataProvider.Attributes["objectQualifier"];
                // append an underscore when it's not there
                if (string.IsNullOrEmpty(objectQualifier) && !objectQualifier.EndsWith("_"))
                    objectQualifier += "_";

                return objectQualifier;
            }
        }
        public static string ConnectionString
        {
            get
            {
                //Get Connection string from web.config
                string _connectionString = Config.GetConnectionString();

                if (string.IsNullOrEmpty(_connectionString))
                {
                    _connectionString = DataProvider.Attributes["connectionString"];
                }

                return _connectionString;
            }
        }
    }
}