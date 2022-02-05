using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ProductApi.Interfaces;
using ProductApi.Models;
using Serilog;

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

        [HttpGet]
        [SwaggerOperation(Summary = "Get all products", Description = "Get products from the Bestbuy Product Api")]
        public async Task<IEnumerable<Product>> GetProducts(int pageSize = 50, int page = 1)
        {
            var products = await _dataService.GetProducts(pageSize, page);
            return products;
        }
    }
}
