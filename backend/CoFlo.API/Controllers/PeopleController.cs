using CoFlo.Application.DTOs;
using CoFlo.Application.Responses;
using MediatR;
using CoFlo.Application.CQRS.People.Queries;
using CoFlo.Application.CQRS.People.Commands;
using Microsoft.AspNetCore.Mvc;
using FluentValidation;

namespace CoFlo.API.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class PeopleController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IValidator<CreatePersonDto> _createValidator;
    private readonly IValidator<UpdatePersonDto> _updateValidator;
    public PeopleController(IMediator mediator, IValidator<CreatePersonDto> createValidator, IValidator<UpdatePersonDto> updateValidator)
    { _mediator = mediator; _createValidator = createValidator; _updateValidator = updateValidator; }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<PersonDto>), 200)]
    public async Task<IActionResult> Get([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? search = null, [FromQuery] string? sortBy = null, [FromQuery] string sortOrder = "asc", [FromQuery] int? minAge = null, [FromQuery] int? maxAge = null)
    {
        if (page < 1 || pageSize < 1 || pageSize > 100)
            return BadRequest(new { message = "Invalid pagination parameters" });
        var result = await _mediator.Send(new GetPeopleQuery(page, pageSize, search, sortBy, sortOrder, minAge, maxAge));
        return Ok(result);
    }

    [HttpGet("stats")]
    [ProducesResponseType(typeof(PeopleStatsDto), 200)]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _mediator.Send(new GetPeopleStatsQuery());
        return Ok(stats);
    }

    [HttpPost]
    [ProducesResponseType(typeof(PersonDto), 201)]
    public async Task<IActionResult> Create([FromBody] CreatePersonDto dto)
    {
        var validation = await _createValidator.ValidateAsync(dto);
        if (!validation.IsValid) return BadRequest(validation.Errors);
        var result = await _mediator.Send(new CreatePersonCommand(dto));
        return CreatedAtAction(nameof(Get), new { page = 1, pageSize = 1 }, result);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(PersonDto), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePersonDto dto)
    {
        var validation = await _updateValidator.ValidateAsync(dto);
        if (!validation.IsValid) return BadRequest(validation.Errors);
        var updated = await _mediator.Send(new UpdatePersonCommand(id, dto));
        return updated is null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(204)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var ok = await _mediator.Send(new SoftDeletePersonCommand(id));
        return ok ? NoContent() : NotFound();
    }

    [HttpPatch("{id:guid}/restore")]
    [ProducesResponseType(typeof(PersonDto), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Restore(Guid id)
    {
        var restored = await _mediator.Send(new RestorePersonCommand(id));
        return restored is null ? NotFound() : Ok(restored);
    }
}
