using CoFlo.Application.Interfaces;
using CoFlo.Application.Responses;
using MediatR;

namespace CoFlo.Application.CQRS.People.Queries;

public class GetPeopleStatsQueryHandler : IRequestHandler<GetPeopleStatsQuery, PeopleStatsDto>
{
    private readonly IPersonService _service;
    public GetPeopleStatsQueryHandler(IPersonService service) { _service = service; }

    public Task<PeopleStatsDto> Handle(GetPeopleStatsQuery request, CancellationToken cancellationToken)
        => _service.GetStatsAsync();
}

