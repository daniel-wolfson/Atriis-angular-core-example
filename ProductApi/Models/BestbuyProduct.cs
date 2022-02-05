using System;

namespace ProductApi.Models
{
    public class BestbuyProduct
    {
        public int SKU { get; set; }
        public string Name { get; set; }
        public Decimal SalePrice { get; set; }
        public string Image { get; set; }
    }

}
