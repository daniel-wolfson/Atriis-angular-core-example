using System.Collections.Generic;

namespace ProductApi.Models
{
    public class BestbuyProducts
    {
        public int from { get; set; }
        public int to { get; set; }
        public int currentPage { get; set; }
        public int total { get; set; }
        public int totalPages { get; set; }
        public string queryTime { get; set; }
        public string totalTime { get; set; }
        public bool partial { get; set; }
        public IEnumerable<BestbuyProduct> Products { get; set; }
    }

}
