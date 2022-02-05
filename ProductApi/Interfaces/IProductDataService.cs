using System.Collections.Generic;
using System.Threading.Tasks;
using ProductApi.Models;

namespace ProductApi.Interfaces
{
    public interface IProductDataService
    {
        Task<IEnumerable<Product>> GetProducts(int pageSize = 50, int page = 1);
    }
}