
using DotNetNuke.Data;
using DotNetNuke.Framework;
using System.Collections.Generic;
using <%= fullNamespace %>.Data;
using <%= fullNamespace %>.Models;

namespace <%= fullNamespace %>.Data
{
    public interface IExampleInfoRepository
    {
        void CreateItem(ExampleInfo t);
        void DeleteItem(int itemId, int moduleId);
        void DeleteItem(ExampleInfo t);
        IEnumerable<ExampleInfo> GetItems(int moduleId);
        ExampleInfo GetItem(int itemId, int moduleId);
        void UpdateItem(ExampleInfo t);
    }

    public class ExampleInfoRepository : ServiceLocator<IExampleInfoRepository, ExampleInfoRepository>, IExampleInfoRepository
    {
        public void CreateItem(ExampleInfo t)
        {
            using (IDataContext ctx = DataContext.Instance())
            {
                var rep = ctx.GetRepository<ExampleInfo>();
                rep.Insert(t);
            }
        }

        public void DeleteItem(int itemId, int moduleId)
        {
            var t = GetItem(itemId, moduleId);
            DeleteItem(t);
        }

        public void DeleteItem(ExampleInfo t)
        {
            using (IDataContext ctx = DataContext.Instance())
            {
                var rep = ctx.GetRepository<ExampleInfo>();
                rep.Delete(t);
            }
        }

        public IEnumerable<ExampleInfo> GetItems(int moduleId)
        {
            IEnumerable<ExampleInfo> t;
            using (IDataContext ctx = DataContext.Instance())
            {
                var rep = ctx.GetRepository<ExampleInfo>();
                t = rep.Get(moduleId);
            }
            return t;
        }

        public ExampleInfo GetItem(int itemId, int moduleId)
        {
            ExampleInfo t;
            using (IDataContext ctx = DataContext.Instance())
            {
                var rep = ctx.GetRepository<ExampleInfo>();
                t = rep.GetById(itemId, moduleId);
            }
            return t;
        }

        public void UpdateItem(ExampleInfo t)
        {
            using (IDataContext ctx = DataContext.Instance())
            {
                var rep = ctx.GetRepository<ExampleInfo>();
                rep.Update(t);
            }
        }

        protected override System.Func<IExampleInfoRepository> GetFactory()
        {
            return () => new ExampleInfoRepository();
        }
    }
}
