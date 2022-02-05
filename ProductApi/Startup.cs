using ProductApi.Core;
using ProductApi.Filters;
using ProductApi.Interfaces;
using ProductApi.Middleware;
using ProductApi.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using ProductApi.Models;
using AutoMapper;

namespace DataServices
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options => options.AddPolicy("ApiCorsPolicy", builder =>
            {
                builder
                    .SetIsOriginAllowed(origin => true)
                    .AllowCredentials()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            }));

            services.AddControllers();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo {Title = "PandoLogic ProductsApi service", Version = "v1"});
            });

            services
                .AddMvc(options => options.Filters.Add(typeof(ApiExceptionFilter)))
                .SetCompatibilityVersion(CompatibilityVersion.Version_3_0);

            var mapperconfig = new MapperConfiguration(cfg => 
                cfg.CreateMap<BestbuyProduct, Product>()
                    .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.SalePrice))
                );
            var mapper = mapperconfig.CreateMapper();

            services.AddSingleton(mapper);
            services.AddHttpClient("products", Configuration);
            services.AddScoped<IProductDataService, ProductDataService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ProductsApi service v1"));
            }

            app.UseMiddleware<ApiContextMiddleware>();
            app.UseMiddleware<ApiErrorHandlingMiddleware>();

            app.UseCors("ApiCorsPolicy");

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}