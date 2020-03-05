
using Newtonsoft.Json.Converters;

namespace <%= fullNamespace %>.Components
{
    public class DateTimeConverter : IsoDateTimeConverter
    {
        public DateTimeConverter()
        {
            base.DateTimeFormat = "MM/dd/yyyy hh:mm tt";
        }
    }
}
