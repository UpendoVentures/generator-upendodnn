
using System;

namespace <%= fullNamespace %>.Entities
{
    public interface I<%= extensionName %>Info
    {
        int ItemId { get; set; }
        int ModuleId { get; set; }
        string Title { get; set; }
        string Description { get; set; }
        int CreatedByUserId { get; set; }
        DateTime CreatedByDate { get; set; }
        int LastUpdatedByUserId { get; set; }
        DateTime LastUpdatedByDate { get; set; }
    }
}