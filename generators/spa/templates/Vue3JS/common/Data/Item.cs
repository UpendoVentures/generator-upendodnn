using DotNetNuke.ComponentModel.DataAnnotations;

namespace <%= fullNamespace %>.Data
{
    using System;
    using System.ComponentModel.DataAnnotations;

    /// <summary>
    /// Class representing an item in the application.
    /// </summary>
    public partial class Item
    {
        /// <summary>
        /// Gets or sets the unique identifier of the item.
        /// </summary>
        [Key]
        public int ItemId { get; set; }

        /// <summary>
        /// Gets or sets the name of the item.
        /// </summary>
        public string ItemName { get; set; }

        /// <summary>
        /// Gets or sets the description of the item.
        /// </summary>
        public string ItemDescription { get; set; }

        /// <summary>
        /// Gets or sets the identifier of the user assigned to this item.
        /// </summary>
        public int? AssignedUserId { get; set; }

        /// <summary>
        /// Gets or sets the module identifier to which the item belongs.
        /// </summary>
        public int ModuleId { get; set; }

        /// <summary>
        /// Gets or sets the date when the item was created.
        /// </summary>
        public DateTime CreatedOnDate { get; set; }

        /// <summary>
        /// Gets or sets the identifier of the user who created the item.
        /// </summary>
        public int CreatedByUserId { get; set; }

        /// <summary>
        /// Gets or sets the date when the item was last modified.
        /// </summary>
        public DateTime LastModifiedOnDate { get; set; }

        /// <summary>
        /// Gets or sets the identifier of the user who last modified the item.
        /// </summary>
        public int LastModifiedByUserId { get; set; }
    }
}
