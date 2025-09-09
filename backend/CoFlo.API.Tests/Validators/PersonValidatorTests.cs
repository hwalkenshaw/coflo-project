using System;
using CoFlo.Application.Validation;
using CoFlo.Application.DTOs;
using FluentAssertions;
using Xunit;

namespace CoFlo.API.Tests.Validators;

public class PersonValidatorTests
{
    [Fact]
    public void CreatePersonValidator_Rejects_Future_DOB()
    {
        var validator = new CreatePersonValidator();
        var result = validator.Validate(new CreatePersonDto { FirstName = "John", LastName = "Doe", DateOfBirth = DateTime.Today.AddDays(1) });
        result.IsValid.Should().BeFalse();
    }
}
