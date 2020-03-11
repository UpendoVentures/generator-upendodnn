
using System.Collections.Generic;
using DotNetNuke.Data;

namespace <%= fullNamespace %>.Entities
{
    public class ExampleInfoRepository
    {
        public void CreateItem(ExampleInfo i)
        {
            using (IDataContext ctx = DataContext.Instance())
            {
                var rep = ctx.GetRepository<ExampleInfo>();
                rep.Insert(i);
            }
        }

        public void DeleteItem(int itemId, int moduleId)
        {
            var i = GetItem(itemId, moduleId);
            DeleteItem(i);
        }

        public void DeleteItem(ExampleInfo i)
        {
            using (IDataContext ctx = DataContext.Instance())
            {
                var rep = ctx.GetRepository<ExampleInfo>();
                rep.Delete(i);
            }
        }

        public IEnumerable<ExampleInfo> GetItems(int moduleId)
        {
            IEnumerable<ExampleInfo> i;
            using (IDataContext ctx = DataContext.Instance())
            {
                var rep = ctx.GetRepository<ExampleInfo>();
                i = rep.Get(moduleId);
            }
            return i;
        }

        public ExampleInfo GetItem(int itemId, int moduleId)
        {
            ExampleInfo i = null;
            using (IDataContext ctx = DataContext.Instance())
            {
                var rep = ctx.GetRepository<ExampleInfo>();
                i = rep.GetById(itemId, moduleId);
            }
            return i;
        }

        public void UpdateItem(ExampleInfo i)
        {
            using (IDataContext ctx = DataContext.Instance())
            {
                var rep = ctx.GetRepository<ExampleInfo>();
                rep.Update(i);
            }
        }
    }
}