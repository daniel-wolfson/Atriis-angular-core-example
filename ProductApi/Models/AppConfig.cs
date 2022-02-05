using System;

namespace ProductApi.Models
{
    public class AppConfig
    {
        public const string Bestbuy = "Bestbuy";
        public string ApiKey { get; set; } = String.Empty;
        public string Uri { get; set; } = String.Empty;
    }
}