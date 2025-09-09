# Project Deliverables Documentation

## API Documentation

### Overview
The CoFlo API is built using .NET 8 Web API with a clean architecture pattern. The API follows RESTful principles and uses CQRS (Command Query Responsibility Segregation) with MediatR for handling business logic.

### API Endpoints

#### People Management
- **GET /api/v1/people** - Retrieve paginated list of people
  - Query parameters: `page`, `pageSize`, `search`, `sortBy`, `sortOrder`, `minAge`, `maxAge`
  - Returns: `PagedResult<PersonDto>`
  
- **GET /api/v1/people/stats** - Get people statistics
  - Returns: `PeopleStatsDto` with total count, average age, etc.

- **POST /api/v1/people** - Create new person
  - Body: `CreatePersonDto` (FirstName, LastName, DateOfBirth)
  - Returns: `PersonDto`

- **PUT /api/v1/people/{id}** - Update existing person
  - Body: `UpdatePersonDto`
  - Returns: `PersonDto`

- **DELETE /api/v1/people/{id}** - Soft delete person
  - Returns: 204 No Content

- **PATCH /api/v1/people/{id}/restore** - Restore soft-deleted person
  - Returns: `PersonDto`

#### Authentication
- **POST /api/v1/auth/login** - User authentication
  - Body: `LoginDto` (Username, Password)
  - Returns: JWT token

### Data Models
The API uses the following main data transfer objects:
- `PersonDto` - Complete person information including calculated age
- `CreatePersonDto` - Required fields for person creation
- `UpdatePersonDto` - Fields that can be updated
- `PeopleStatsDto` - Statistical information about people data

## Website Frontend Documentation

### Architecture
The frontend is a React 18 application built with TypeScript and Vite. It follows a component-based architecture with Material-UI for the design system.

### Key Features
- **Dashboard** - Overview with KPI cards, age distribution charts, and recent activity
- **People Management** - Full CRUD operations with data grid, search, and filtering
- **Authentication** - JWT-based login system
- **Responsive Design** - Works on desktop, tablet, and mobile devices

### Component Structure
- `layout/` - Application layout and navigation components
- `dashboard/` - Dashboard widgets and KPI cards
- `people/` - People management components (grid, forms, dialogs)
- `common/` - Reusable components like error boundaries and animated elements

### State Management
The application uses React hooks and context for state management, with Axios for API communication.

## Implementation Choices & Rationale

### Backend Architecture
I chose to implement the backend using Clean Architecture principles for several reasons:

1. **Separation of Concerns** - Each layer has a specific responsibility (Domain, Application, Infrastructure, API)
2. **Testability** - Business logic is isolated from external dependencies
3. **Maintainability** - Code is organized in a way that makes it easy to modify and extend
4. **CQRS with MediatR** - Separates read and write operations, making the code more scalable

### Database Choice
I implemented the solution using Entity Framework Core with an in-memory database because:

1. **Rapid Development** - No need to set up external database infrastructure
2. **Testing** - Easy to create isolated test scenarios
3. **Demonstration** - Simplifies deployment and demonstration of the application
4. **Future Flexibility** - Easy to switch to a persistent database later

### Frontend Technology Stack
I chose React with TypeScript and Material-UI because:

1. **Type Safety** - TypeScript provides compile-time error checking
2. **Component Reusability** - React's component model promotes code reuse
3. **Rich UI Components** - Material-UI provides a comprehensive set of components
4. **Performance** - Vite offers fast development builds and hot module replacement

## SQL Table Design (In-Memory Entity Framework)

Since the application uses Entity Framework with an in-memory database, here's the equivalent SQL table structure:

```sql
CREATE TABLE People (
    Id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
    FirstName nvarchar(50) NOT NULL,
    LastName nvarchar(50) NOT NULL,
    DateOfBirth datetime2 NOT NULL,
    CreatedAt datetime2 NOT NULL DEFAULT GETUTCDATE(),
    CreatedBy nvarchar(255) NULL,
    UpdatedAt datetime2 NULL,
    UpdatedBy nvarchar(255) NULL,
    IsDeleted bit NOT NULL DEFAULT 0,
    DeletedAt datetime2 NULL,
    DeletedBy nvarchar(255) NULL
);

-- Index for soft delete filter
CREATE INDEX IX_People_IsDeleted ON People (IsDeleted);

-- Index for name searches
CREATE INDEX IX_People_Names ON People (FirstName, LastName);

-- Index for date queries
CREATE INDEX IX_People_DateOfBirth ON People (DateOfBirth);
```

The Person entity includes audit fields for tracking creation, updates, and soft deletes. The Age property is calculated dynamically rather than stored.

## Deployment Instructions

### Prerequisites
- Windows Server with IIS
- .NET 8 Hosting Bundle
- Node.js 18+ and npm
- Modern web browser

### Backend Deployment
1. **Build the API:**
   ```bash
   cd backend
   dotnet publish CoFlo.API/CoFlo.API.csproj -c Release -o ../publish
   ```

2. **Deploy to IIS:**
   - Copy published files to `C:\inetpub\wwwroot\coflo-api\`
   - Create new website in IIS Manager
   - Set application pool to "No Managed Code"
   - Configure port (default: 8080)

3. **Configure CORS:**
   - Update `appsettings.json` with frontend URL
   - Ensure CORS policy allows frontend domain

### Frontend Deployment
1. **Build the React app:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to IIS:**
   - Copy `dist` folder contents to `C:\inetpub\wwwroot\coflo-frontend\`
   - Add `web.config` for React Router support
   - Configure IIS website on desired port

## Testing Instructions

### Backend Testing
Run unit tests for the API:
```bash
npm run test:backend
```

The test suite includes:
- Repository tests with in-memory database
- Service layer tests
- Controller integration tests
- Validation tests

### Frontend Testing
Run React component tests:
```bash
cd frontend
npm test
```

### Manual Testing
1. **Start development servers:**
   ```bash
   npm run dev
   ```

2. **Access the application:**
   - Frontend: http://localhost:5173
   - API: https://localhost:5001/swagger

3. **Test user workflows:**
   - Login with demo credentials
   - Create, edit, and delete people records
   - Use search and filtering features
   - View dashboard analytics

## Prerequisites & Key Libraries

### Backend Dependencies
1. **Microsoft.AspNetCore.App** - Core ASP.NET framework
2. **Microsoft.EntityFrameworkCore.InMemory** - In-memory database provider
3. **AutoMapper.Extensions.Microsoft.DependencyInjection** - Object mapping
4. **MediatR** - CQRS and mediator pattern implementation
5. **FluentValidation.AspNetCore** - Request validation
6. **Microsoft.AspNetCore.Authentication.JwtBearer** - JWT authentication
7. **Swashbuckle.AspNetCore** - API documentation (Swagger)
8. **Serilog.AspNetCore** - Structured logging

### Frontend Dependencies (Top 10)
1. **React 18** - UI library for building user interfaces
2. **TypeScript** - Type-safe JavaScript superset
3. **@mui/material** - Material-UI component library
4. **@mui/x-data-grid** - Advanced data grid component
5. **axios** - HTTP client for API requests
6. **react-router-dom** - Client-side routing
7. **@mui/x-charts** - Charting components for analytics
8. **react-hook-form** - Form handling and validation
9. **framer-motion** - Animation library
10. **date-fns** - Date utility library

## IDE Choice & Justification

### Primary IDE: Visual Studio Code
I chose Visual Studio Code as the primary development environment for this project for several reasons:

1. **Cross-Platform Support** - Works consistently across Windows, macOS, and Linux
2. **Excellent TypeScript Support** - Built-in IntelliSense and debugging for TypeScript/React
3. **Integrated Terminal** - Allows running both frontend and backend commands in one interface
4. **Extension Ecosystem** - Rich marketplace with extensions for .NET, React, and database tools
5. **Git Integration** - Built-in source control makes version management seamless
6. **Multi-Language Support** - Handles both C# and TypeScript/JavaScript effectively

### Secondary Tool: Visual Studio 2022
For more complex backend development and debugging, Visual Studio 2022 was used occasionally because:

1. **Superior .NET Debugging** - Advanced debugging tools for C# applications
2. **Built-in Package Manager** - Easy NuGet package management
3. **Database Tools** - Integrated SQL Server tools and Entity Framework support

The combination of both IDEs provided the best development experience, with VS Code for daily development and Visual Studio for advanced debugging when needed.

## Additional Notes

### Performance Considerations
- The in-memory database resets on application restart
- Frontend uses lazy loading for better initial load times
- API includes pagination to handle large datasets efficently

### Security Features
- JWT token-based authentication
- Input validation using FluentValidation
- CORS configuration to prevent unauthorized access
- Soft deletes to maintain data integrity

### Future Enhancements
- Migration to persistent database (SQL Server/PostgreSQL)
- Real-time updates using SignalR
- Advanced reporting and analytics features
- User role management and permissions