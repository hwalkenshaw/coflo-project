using CoFlo.Application.Responses;
using MediatR;

namespace CoFlo.Application.CQRS.People.Queries;

public record GetPeopleStatsQuery() : IRequest<PeopleStatsDto>;

