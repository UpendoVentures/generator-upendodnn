
using DotNetNuke.ComponentModel.DataAnnotations;
using System;
using System.Web.Caching;

namespace <%= fullNamespace %>.Models
{
    [TableName("<%= objectPrefix %>_Example")]
    //setup the primary key for table
    [PrimaryKey("ExampleId", AutoIncrement = true)]
    //configure caching using PetaPoco
    [Cacheable("ExampleInfo", CacheItemPriority.Default, 20)]
    //scope the objects to the ModuleId of a module on a page (or copy of a module on a page)
    [Scope("ModuleId")]
    public class ExampleInfo : IExampleInfo
    {
        public ExampleInfo()
        {
            ExampleId = -1;
        }

        public int ExampleId { get; set; }

        public int ModuleId { get; set; }

        public string Title { get; set; }

        public string Description { get; set; }

        public int CreatedByUserId { get; set; }

        public DateTime CreatedOnDate { get; set; }

        public int LastUpdatedByUserId { get; set; }

        public DateTime LastUpdatedOnDate { get; set; }
    }
}
