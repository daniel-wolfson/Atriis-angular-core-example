using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Net.Http;

namespace ProductApi.Core
{
    public static class HttpClientExtensions
    {
        public static void AddHttpClient(this IServiceCollection services, string namedEndpoint, IConfiguration config)
        {
            var endpoint = config.GetSection($"AppConfig:Endpoint").Value;

            services.AddHttpClient(namedEndpoint,
                httpClient =>
                {
                    httpClient.BaseAddress = new Uri($"{endpoint}{namedEndpoint}");
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
