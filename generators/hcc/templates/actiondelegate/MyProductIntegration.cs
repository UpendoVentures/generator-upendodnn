
using Hotcakes.Commerce;
using Hotcakes.Modules.Core.Integration;
using Hotcakes.Modules.Core.Models;

namespace <%= fullNamespace %>.MyIntegration
{
    public class MyProductIntegration : IProductIntegration
    {
        public IntegrationResult BeforeProductAddedToCart(HotcakesApplication hccApp, ProductPageViewModel model)
        {
            return new IntegrationResult
            {
                IsAborted = true,
                AbortMessage =
                    string.Format("My Test Product Integration - Product Name: {0}", model.LocalProduct.ProductName)
            };
        }
    }
}