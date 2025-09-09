using CoFlo.Application.DTOs;
using CoFlo.Application.Interfaces;
using CoFlo.Application.Responses;
using MediatR;

namespace CoFlo.Application.CQRS.People.Queries;

public class GetPeopleQueryHandler : IRequestHandler<GetPeopleQuery, PagedResult<PersonDto>>
{
    private readonly IPersonService _service;
    public GetPeopleQueryHandler(IPersonService service) { _service = service; }

    public Task<PagedResult<PersonDto>> Handle(GetPeopleQuery request, CancellationToken cancellationToken)
        => _service.GetPeopleAsync(request.Page, request.PageSize, request.Search, request.SortBy, request.SortOrder, request.MinAge, request.MaxAge);
}

