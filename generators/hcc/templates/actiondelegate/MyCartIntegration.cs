
using Hotcakes.Commerce;
using Hotcakes.Modules.Core.Integration;
using Hotcakes.Modules.Core.Models;

namespace <%= fullNamespace %>.MyIntegration
{
    public class MyCartIntegration : ICartIntegration
    {
        public IntegrationResult BeforeProceedToCheckout(HotcakesApplication hccApp, CartViewModel model)
        {
            return new IntegrationResult
            {
                IsAborted = true,
                AbortMessage = string.Format("My Test Cart Integration - Total: {0}", model.CurrentOrder.TotalGrand)
            };
        }
    }
}