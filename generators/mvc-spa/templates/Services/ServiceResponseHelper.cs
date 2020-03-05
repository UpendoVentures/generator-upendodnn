
namespace <%= fullNamespace %>.Services
{
    public static class ServiceResponseHelper<T>
    {
        public static void AddNoneFoundError(string objectName, ref ServiceResponse<T> response)
        {
            response.Errors.Add(new ServiceError()
            {
                Code = "NONE-FOUND",
                Description = string.Format("Unable to find any {0} to return.", objectName)
            });
        }

        public static void AddUserCreateError(string errorName, ref ServiceResponse<T> response)
        {
            response.Errors.Add(new ServiceError()
            {
                Code = "USER-CREATE-ERROR",
                Description = string.Format("{0}", errorName)
            });
        }

        public static void AddUnknownError(ref ServiceResponse<T> response)
        {
            response.Errors.Add(new ServiceError()
            {
                Code = "UNKNOWN-ERROR",
                Description = "An unknown error occurred. Check the event viewer or contact your site administrator"
            });
        }

        public static void AddErrorMessage(string message, ref ServiceResponse<T> response)
        {
            response.Errors.Add(new ServiceError()
            {
                Code = "MESSAGE",
                Description = message
            });
        }
    }
}