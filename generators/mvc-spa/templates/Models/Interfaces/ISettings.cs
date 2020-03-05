
using System;

namespace <%= fullNamespace %>.Models
{
    public interface ISettings
    {
        bool Setting1 { get; set; }
        string Setting2 { get; set; }
        DateTime Setting3 { get; set; }
    }
}