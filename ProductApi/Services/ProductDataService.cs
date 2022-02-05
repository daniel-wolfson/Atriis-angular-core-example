using System;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using ProductApi.Interfaces;
using ProductApi.Models;
using Serilog;
using AutoMapper;

namespace ProductApi.Services
{
    public class ProductDataService : IProductDataService
    {
        private readonly HttpClient _httpClient;
        private readonly IMapper _mapper;
        private readonly ILogger _logger;

        public ProductDataService(IHttpClientFactory httpClientFactory, ILogger logger, IMapper mapper)
        {
            _httpClient = httpClientFactory.CreateClient("products");
            _logger = logger;
            _mapper = mapper;
        }

        /// <summary> get all products </summary>
        public async Task<IEnumerable<Product>> GetProducts(int pageSize = 50, int page = 1)
        {
            IEnumerable<Product> results = new List<Product>();
            HttpResponseMessage httpResponse;

            try
            {
                string uriString = $"{_httpClient.BaseAddress}&pageSize={pageSize}&page={page}";
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

            return results;
        }
    }
}