using CoFlo.Application.DTOs;
using MediatR;

namespace CoFlo.Application.CQRS.People.Commands;

public record CreatePersonCommand(CreatePersonDto Dto) : IRequest<PersonDto>;

