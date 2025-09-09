using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace CoFlo.Application.DependencyInjection;

public static class ApplicationServiceCollectionExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Register all FluentValidation validators in this assembly
        services.AddValidatorsFromAssembly(typeof(ApplicationServiceCollectionExtensions).Assembly);
        // Register MediatR handlers from this assembly (MediatR v11)
        services.AddMediatR(typeof(ApplicationServiceCollectionExtensions).Assembly);
        return services;
    }
}
