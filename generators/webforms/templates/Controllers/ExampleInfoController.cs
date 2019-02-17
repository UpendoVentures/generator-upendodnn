
using System.Collections.Generic;
using System.Linq;
using <%= fullNamespace %>.Entities;

namespace <%= fullNamespace %>.Controllers
{
    public class ExampleInfoController
    {
        private readonly ExampleInfoRepository repo = null;

        public ExampleInfoController() 
        {
            repo = new ExampleInfoRepository();
        }

        public void CreateItem(ExampleInfo i)
        {
            repo.CreateItem(i);
        }

        public void DeleteItem(int itemId, int moduleId)
        {
            repo.DeleteItem(itemId, moduleId);
        }

        public void DeleteItem(ExampleInfo i)
        {
            repo.DeleteItem(i);
        }

        public IEnumerable<ExampleInfo> GetItems(int moduleId)
        {
            var items = repo.GetItems(moduleId);
            return items;
        }

        public ExampleInfo GetItem(int itemId, int moduleId)
        {
            var item = repo.GetItem(itemId, moduleId);
            return item;
        }

        public void UpdateItem(ExampleInfo i)
        {
            repo.UpdateItem(i);
        }

        public ExampleInfo GetItemByModuleId(int moduleId)
        {
            var items = GetItems(moduleId);

            return items.FirstOrDefault(i => i.ModuleId == moduleId);
        }
    }
}