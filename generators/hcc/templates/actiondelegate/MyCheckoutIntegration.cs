
using Hotcakes.Commerce;
using Hotcakes.Modules.Core.Integration;
using Hotcakes.Modules.Core.Models;

namespace <%= fullNamespace %>.MyIntegration
{
    public class MyCheckoutIntegration : ICheckoutIntegration
    {
        public IntegrationResult BeforeCheckoutCompleted(HotcakesApplication hccApp, CheckoutViewModel model)
        {
            return new IntegrationResult
            {
                IsAborted = true,
                AbortMessage =
                    string.Format("My Test Checkout Integration - First Name: {0}",
                        model.CurrentOrder.ShippingAddress.FirstName)
            };
        }
    }
}