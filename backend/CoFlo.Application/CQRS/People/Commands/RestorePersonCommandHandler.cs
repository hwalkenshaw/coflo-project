using CoFlo.Application.DTOs;
using CoFlo.Application.Interfaces;
using MediatR;

namespace CoFlo.Application.CQRS.People.Commands;

public class RestorePersonCommandHandler : IRequestHandler<RestorePersonCommand, PersonDto?>
{
    private readonly IPersonService _service;
    public RestorePersonCommandHandler(IPersonService service) { _service = service; }

    public Task<PersonDto?> Handle(RestorePersonCommand request, CancellationToken cancellationToken)
        => _service.RestoreAsync(request.Id);
}

