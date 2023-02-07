using <%= fullNamespace %>.Components;
using <%= fullNamespace %>.Data;
using Newtonsoft.Json;

namespace <%= fullNamespace %>.ViewModels
{
    [JsonObject(MemberSerialization.OptIn)]
    public class ItemViewModel
    {
        public ItemViewModel(Item t)
        {
            Id = t.ItemId;
            Name = t.ItemName;
            Description = t.ItemDescription;
            AssignedUser = t.AssignedUserId;
            CreatedOnDate = t.CreatedOnDate.ToShortDateString();
        }

        public ItemViewModel(Item t, bool canEdit) : this(t)
        {
            CanEdit = canEdit;
        }


        public ItemViewModel() { }

        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("assignedUser")]
        public int? AssignedUser { get; set; }

        [JsonProperty("canEdit")]
        public bool CanEdit { get; }

        [JsonProperty("createdOnDate")]
        public string CreatedOnDate { get; }

    }
}