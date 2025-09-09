using CoFlo.Application.Interfaces;
using CoFlo.Infrastructure.Auth;
using CoFlo.Infrastructure.Persistence;
using CoFlo.Infrastructure.Persistence.Repositories;
using CoFlo.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace CoFlo.Infrastructure.DependencyInjection;

public static class InfrastructureServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<AppDbContext>(options => options.UseInMemoryDatabase("CoFloDb"));

        services.AddScoped<IPersonRepository, PersonRepository>();
        services.AddScoped<IPersonService, PersonService>();
        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}

