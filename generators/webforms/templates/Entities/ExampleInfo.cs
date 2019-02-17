
using System;
using System.Web.Caching;
using DotNetNuke.ComponentModel.DataAnnotations;

namespace <%= fullNamespace %>.Entities
{
    [TableName("<%= objectPrefix %>_Example")]
    [PrimaryKey("ExampleId", AutoIncrement = true)]
    [Cacheable("ExampleInfo", CacheItemPriority.Default, 20)]
    [Scope("ModuleId")]
    public class ExampleInfo : IExampleInfo
    {
        public int ExampleId { get; set; }

        public int ModuleId { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public int CreatedByUserId { get; set; }

        public DateTime CreatedByDate { get; set; }

        public int LastUpdatedByUserId { get; set; }

        public DateTime LastUpdatedByDate { get; set; }
    }
}