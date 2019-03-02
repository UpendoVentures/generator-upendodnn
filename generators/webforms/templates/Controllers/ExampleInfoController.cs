
using System.Collections.Generic;
using System.Linq;
using <%= fullNamespace %>.Entities;

namespace <%= fullNamespace %>.Controllers
{
    public class <%= extensionName %>InfoController
    {
        private readonly <%= extensionName %>InfoRepository repo = null;

        public <%= extensionName %>InfoController() 
        {
            repo = new <%= extensionName %>InfoRepository();
        }

        public void CreateItem(<%= extensionName %>Info i)
        {
            repo.CreateItem(i);
        }

        public void DeleteItem(int itemId, int moduleId)
        {
            repo.DeleteItem(itemId, moduleId);
        }

        public void DeleteItem(<%= extensionName %>Info i)
        {
            repo.DeleteItem(i);
        }

        public IEnumerable<<%= extensionName %>Info> GetItems(int moduleId)
        {
            var items = repo.GetItems(moduleId);
            return items;
        }

        public <%= extensionName %>Info GetItem(int itemId, int moduleId)
        {
            var item = repo.GetItem(itemId, moduleId);
            return item;
        }

        public void UpdateItem(<%= extensionName %>Info i)
        {
            repo.UpdateItem(i);
        }

        public <%= extensionName %>Info GetItemByModuleId(int moduleId)
        {
            var items = GetItems(moduleId);

            return items.FirstOrDefault(i => i.ModuleId == moduleId);
        }
    }
}