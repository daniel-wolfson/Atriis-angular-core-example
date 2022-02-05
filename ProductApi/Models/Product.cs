using System;

namespace ProductApi.Models
{
    ///<summary> Product data item <summary>
    public class Product
    {
        public int SKU { get; set; }
        public string Name { get; set; }
        public Decimal Price { get; set; }
        public string Image { get; set; }
    }

}
