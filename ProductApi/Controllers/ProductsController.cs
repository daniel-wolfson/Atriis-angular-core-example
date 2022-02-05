using Microsoft.AspNetCore.Mvc;
using ProductApi.Interfaces;
using ProductApi.Models;
using Swashbuckle.AspNetCore.Annotations;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductDataService _dataService;

        public ProductsController(IProductDataService dataService)
        {
            _dataService = dataService;
        }

        [HttpGet] //("{productFilter?}")
        [SwaggerOperation(Summary = "Get all products", Description = "Get products from the Bestbuy Product Api")]
        public async Task<IEnumerable<Product>> GetProducts(int pageSize = 50, int page = 1, string productFilter = null)
        {
            var products = await _dataService.GetProducts(pageSize, page, productFilter);
            return products;
        }

        [HttpGet("{sku}")]
        [SwaggerOperation(Summary = "Get product", Description = "Get products from the Bestbuy Product Api")]
        public async Task<Product> GetProduct(int sku)
        {
            var product = await _dataService.GetProduct(sku);
            return product;
        }
    }
}
