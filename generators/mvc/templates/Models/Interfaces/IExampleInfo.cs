
using System;

namespace <%= fullNamespace %>.Models
{
    public interface IExampleInfo
    {
        int ExampleId { get; set; }
        int ModuleId { get; set; }
        string Title { get; set; }
        string Description { get; set; }
        int CreatedByUserId { get; set; }
        DateTime CreatedOnDate { get; set; }
        int LastUpdatedByUserId { get; set; }
        DateTime LastUpdatedOnDate { get; set; }
    }
}