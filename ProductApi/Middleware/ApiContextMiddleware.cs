using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using ProductApi.Core;

namespace ProductApi.Middleware
{
    public class ApiContextMiddleware
    {
        private readonly RequestDelegate _next;
        private IServiceScope _serviceScope;

        public ApiContextMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            if (httpContext.Request.Path.Value.StartsWith("/api"))
            {
                _serviceScope = httpContext.RequestServices.CreateScope();
            }

            await _next(httpContext);

            if (httpContext.Request.Path.Value.StartsWith("/api"))
            {
                _serviceScope?.Dispose();
            }
        }
    }
}

