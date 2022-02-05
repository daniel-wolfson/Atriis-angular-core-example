using ProductApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ProductApi.Interfaces
{
    public interface IProductDataService
    {
        Task<IEnumerable<Product>> GetProducts(int pageSize = 50, int page = 1, string productFilter = null);
        Task<Product> GetProduct(int sku);
    }
}