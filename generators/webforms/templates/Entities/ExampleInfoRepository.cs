
using System.Collections.Generic;
using DotNetNuke.Data;

namespace <%= fullNamespace %>.Entities
{
    public class <%= extensionName %>InfoRepository
    {
        public void CreateItem(<%= extensionName %>Info i)
        {
            using (IDataContext ctx = DataContext.Instance())
            {
                var rep = ctx.GetRepository<<%= extensionName %>Info>();
                rep.Insert(i);
            }
        }

        public void DeleteItem(int itemId, int moduleId)
        {
            var i = GetItem(itemId, moduleId);
            DeleteItem(i);
        }

        public void DeleteItem(<%= extensionName %>Info i)
        {
            using (IDataContext ctx = DataContext.Instance())
            {
                var rep = ctx.GetRepository<<%= extensionName %>Info>();
                rep.Delete(i);
            }
        }

        public IEnumerable<<%= extensionName %>Info> GetItems(int moduleId)
        {
            IEnumerable<<%= extensionName %>Info> i;
            using (IDataContext ctx = DataContext.Instance())
            {
                var rep = ctx.GetRepository<<%= extensionName %>Info>();
                i = rep.Get(moduleId);
            }
            return i;
        }

        public <%= extensionName %>Info GetItem(int itemId, int moduleId)
        {
            <%= extensionName %>Info i = null;
            using (IDataContext ctx = DataContext.Instance())
            {
                var rep = ctx.GetRepository<<%= extensionName %>Info>();
                i = rep.GetById(itemId, moduleId);
            }
            return i;
        }

        public void UpdateItem(<%= extensionName %>Info i)
        {
            using (IDataContext ctx = DataContext.Instance())
            {
                var rep = ctx.GetRepository<<%= extensionName %>Info>();
                rep.Update(i);
            }
        }
    }
}