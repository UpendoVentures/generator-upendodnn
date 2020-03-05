
using System.Collections.Generic;

namespace <%= fullNamespace %>.Services
{
    public interface IServiceResponse
    {
        List<ServiceError> Errors { get; set; }
    }
}