using System;
using CoFlo.Domain.Entities;
using FluentAssertions;
using Xunit;

namespace CoFlo.API.Tests.Models;

public class PersonTests
{
    [Theory]
    [InlineData("2000-01-01")]
    [InlineData("1980-06-15")]
    public void Age_Is_NonNegative(string date)
    {
        var dob = DateTime.Parse(date);
        Person.CalculateAge(dob).Should().BeGreaterOrEqualTo(0);
    }
}

