using DotNetNuke.Web.Api;
using System.Net.Http;
using System.Web.Http;
using <%= fullNamespace %>.Data;
using <%= fullNamespace %>.Repository;
using System.Net;
using System.Threading.Tasks;
using <%= fullNamespace %>.Constants;
using DotNetNuke.Security;

namespace <%= fullNamespace %>.Services
{
    [SupportedModules(ModuleConstants.SupportedModules)]
    [DnnModuleAuthorize(AccessLevel = SecurityAccessLevel.View)]
    public class ItemsController : DnnApiController
    {
        private readonly ItemsRepository _itemRepository;

        public ItemsController(ItemsRepository itemRepository)
        {
            _itemRepository = itemRepository;
        }

        [HttpGet]
        public HttpResponseMessage GetAll()
        {
            var items = _itemRepository.GetAllAsync().Result;
            return Request.CreateResponse(items);
        }

        [HttpGet]
        public HttpResponseMessage GetById(int Id)
        {
            var items = _itemRepository.GetByItemId(Id).Result;
            return Request.CreateResponse(items);
        }

        [HttpPost()]
        public async Task<HttpResponseMessage> Create(Item item)
        {
            await _itemRepository.CreateAsync(item);
            return Request.CreateResponse(HttpStatusCode.OK, item);
        } 
        [HttpPut()]
        public async Task<HttpResponseMessage> Update(Item item)
        {
            await _itemRepository.UpdateAsync(item);
            return Request.CreateResponse(HttpStatusCode.OK, item);
        }

        [HttpDelete()]
        public async Task<HttpResponseMessage> Delete(int id)
        {
            await _itemRepository.DeleteAsync(id);
            return Request.CreateResponse(HttpStatusCode.OK, id);
        }

    }
}
