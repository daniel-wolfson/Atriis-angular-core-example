using System;
using System.Net.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace ProductApi.Core
{
    public static class HttpClientExtensions
    {
        public static void AddHttpClient(this IServiceCollection services, string namedHttpClient, IConfiguration config)
        {
            var apiKey = config.GetSection($"AppConfig:ApiKey").Value;
            var endpoint = config.GetSection($"AppConfig:Endpoint").Value;

            services.AddHttpClient(namedHttpClient,
                httpClient =>
                {
                    httpClient.BaseAddress = 
                        new Uri($"{endpoint}{namedHttpClient}?pageSize=50&format=json&show=sku,name,salePrice,image,startDate&apiKey={apiKey}");
                    httpClient.Timeout = TimeSpan.FromSeconds(10);
                })
                .ConfigurePrimaryHttpMessageHandler(provider =>
                {
                    var handler = new HttpClientHandler();
                    var env = provider.GetService<IWebHostEnvironment>();
                    if (env.IsDevelopment())
                        handler.ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => { return true; };
                    return handler;
                });
        }
    }
}
