using CoFlo.Application.DTOs;
using CoFlo.Application.Responses;
using MediatR;

namespace CoFlo.Application.CQRS.People.Queries;

public record GetPeopleQuery(
    int Page = 1,
    int PageSize = 10,
    string? Search = null,
    string? SortBy = null,
    string SortOrder = "asc",
    int? MinAge = null,
    int? MaxAge = null
) : IRequest<PagedResult<PersonDto>>;

