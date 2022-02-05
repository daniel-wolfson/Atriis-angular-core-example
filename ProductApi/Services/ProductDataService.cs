using AutoMapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using ProductApi.Interfaces;
using ProductApi.Models;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace ProductApi.Services
{
    public class ProductDataService : IProductDataService
    {
        private readonly HttpClient _httpClient;
        private readonly IMapper _mapper;
        private readonly ILogger _logger;
        private readonly string _apiKey;

        public ProductDataService(IHttpClientFactory httpClientFactory, ILogger logger,
            IMapper mapper, IConfiguration config)
        {
            _apiKey = config.GetSection($"AppConfig:ApiKey").Value;
            _httpClient = httpClientFactory.CreateClient("products");
            _logger = logger;
            _mapper = mapper;
        }

        /// <summary> get all products </summary>
        public async Task<Product> GetProduct(int sku)
        {
            Product result = default;
            HttpResponseMessage httpResponse;

            try
            {
                string uriString = $"{_httpClient.BaseAddress}/{sku}.json?apiKey={_apiKey}";
                var httpRequest = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri(uriString)
                };

                httpResponse = await _httpClient.SendAsync(httpRequest);
                var stringResult = httpResponse.Content.ReadAsStringAsync().Result;

                var bestbuyProduct = JsonConvert.DeserializeObject<BestbuyProduct>(stringResult);
                result = _mapper.Map<Product>(bestbuyProduct);

                _logger.Information($"{nameof(ProductDataService)}.{nameof(GetProducts)} got results from {uriString}");
            }
            catch (Exception ex)
            {
                _logger.Error(ex.InnerException?.Message ?? ex.Message);
            }

            return result;
        }

        public async Task<IEnumerable<Product>> GetProducts(int pageSize = 50, int page = 1, string productFilter = null)
        {
            IEnumerable<Product> results = new List<Product>();
            HttpResponseMessage httpResponse;

            try
            {
                string uriString = $"{_httpClient.BaseAddress}?pageSize={pageSize}&page={page}" +
                    $"&format=json&show=sku,name,salePrice,image,startDate&apiKey={_apiKey}";
                var httpRequest = new HttpRequestMessage
                {
                    Method = HttpMethod.Get,
                    RequestUri = new Uri(uriString)
                };

                httpResponse = await _httpClient.SendAsync(httpRequest);
                var stringResult = httpResponse.Content.ReadAsStringAsync().Result;

                var bestbuyProducts = JsonConvert.DeserializeObject<BestbuyProducts>(stringResult);
                results = _mapper.Map<IEnumerable<Product>>(bestbuyProducts.Products);

                _logger.Information($"{nameof(ProductDataService)}.{nameof(GetProducts)} got results from {uriString}");
            }
            catch (Exception ex)
            {
                _logger.Error(ex.InnerException?.Message ?? ex.Message);
            }

            if (string.IsNullOrEmpty(productFilter))
            {
                results = results.Where(x => x.Name.Contains(productFilter));
            }

            return results;
        }
    }
}