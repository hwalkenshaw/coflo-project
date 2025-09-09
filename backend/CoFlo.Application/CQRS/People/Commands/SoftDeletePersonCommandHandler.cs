using CoFlo.Application.Interfaces;
using MediatR;

namespace CoFlo.Application.CQRS.People.Commands;

public class SoftDeletePersonCommandHandler : IRequestHandler<SoftDeletePersonCommand, bool>
{
    private readonly IPersonService _service;
    public SoftDeletePersonCommandHandler(IPersonService service) { _service = service; }

    public Task<bool> Handle(SoftDeletePersonCommand request, CancellationToken cancellationToken)
        => _service.SoftDeleteAsync(request.Id);
}

