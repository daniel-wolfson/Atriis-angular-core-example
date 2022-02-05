using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using Newtonsoft.Json;
using Serilog;
using System;
using System.Net;
using System.Threading.Tasks;

namespace ProductApi.Middleware
{
    public class ApiErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger _logger;

        public ApiErrorHandlingMiddleware(RequestDelegate next, IWebHostEnvironment environment, ILogger logger)
        {
            _next = next;
            _environment = environment;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                context.Response.OnStarting(async (state) =>
                {
                    if (context.Request.Path.Value.StartsWith("/api") && context.Response.StatusCode == StatusCodes.Status400BadRequest)
                    {
                        var ex = context.Features.Get<IExceptionHandlerFeature>()?.Error;
                        if (ex != null)
                        {
                            context.Response.Clear();
                            await HandleExceptionAsync(context, new Exception(StatusCodes.Status400BadRequest.ToString())).ConfigureAwait(false);
                        }
                    }
                    await Task.CompletedTask;
                }, new object());

                await _next(context);


                if (context.Request.Path.HasValue && context.Request.Path.Value.Contains("/api/") && !context.Response.HasStarted)
                {
                    _logger.Error($"{nameof(ApiErrorHandlingMiddleware)} path: {context.Request.Path.Value}. Response has not started!");
                }
            }
            catch (Exception ex)
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            object response = GetResponseDetails(context, ex);
            string json = JsonConvert.SerializeObject(response);

            if (context.Response.ContentType == null)
                context.Response.ContentType = "application/json";

            _logger.Error($"{nameof(ApiErrorHandlingMiddleware)}: ", json);

            await context.Response.WriteAsync(json);
        }

        private object GetResponseDetails(HttpContext context, Exception apiException = null, string message = null)
        {
            object response;
            try
            {
                // get action  action ReturnType
                Type responseDeclaredType = GetActionReturnType(context);
                HttpStatusCode statusCode = apiException != null ? HttpStatusCode.Conflict : (HttpStatusCode)context.Response.StatusCode;

                // create api response
                response = new
                {
                    RequestUrl = context.Request.Path,
                    ActionType = responseDeclaredType,
                    StatusCode = $"{(int)statusCode}: {statusCode}",
                    Message = message ?? apiException?.Message ?? ((HttpStatusCode)context.Response.StatusCode).ToString(),
                    Error = apiException != null ? apiException.ToString() : null
                };

                _logger.Error(response.ToString());
            }
            catch (Exception ex)
            {
                _logger.Error(ex.Message ?? ex.InnerException?.Message ?? "error");
                response = new object() { };
            }

            return response;
        }

        private Type GetActionReturnType(HttpContext context)
        {
            Type responseDeclaredType = null;
            Endpoint endpoint = context.GetEndpoint();

            if (endpoint != null)
            {
                var controllerActionDescriptor = endpoint.Metadata.GetMetadata<ControllerActionDescriptor>();
                if (controllerActionDescriptor != null)
                {
                    responseDeclaredType = controllerActionDescriptor.MethodInfo.ReturnType;

                    if (controllerActionDescriptor.MethodInfo.ReturnType.IsGenericType)
                    {
                        if (controllerActionDescriptor.MethodInfo.ReturnType.GetGenericTypeDefinition() == typeof(ActionResult<>))
                        {
                            responseDeclaredType = controllerActionDescriptor.MethodInfo.ReturnType.GetGenericArguments()[0];
                        }
                    }
                }
            }

            return responseDeclaredType;
        }
    }
}

