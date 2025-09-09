# CoFlo Application

CoFlo is a modern web application built with a .NET 8 Web API backend and React frontend. This solution provides a comprehensive platform for managing workflow processes with an intuitive user interface.

## Project Structure

```
coflo-project/
├── backend/                 # .NET 8 Web API
│   ├── CoFlo.API/          # Main API project
│   ├── CoFlo.Application/  # Application layer
│   ├── CoFlo.Domain/       # Domain layer
│   ├── CoFlo.Infrastructure/ # Infrastructure layer
│   └── CoFlo.API.Tests/    # Unit tests
├── frontend/               # React frontend with Vite
│   ├── src/               # Source files
│   ├── public/            # Static assets
│   └── package.json       # Node dependencies
└── package.json           # Root package configuration
```

## Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** (v18.0 or higher)
- **npm** (v8.0 or higher)  
- **.NET 8 SDK**
- **IIS** (for production deployment)
- **SQL Server** (if using database functionality)

## Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd coflo-project
```

### 2. Install Dependencies

Install root dependencies:
```bash
npm install
```

Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

### 3. Backend Configuration

Navigate to the backend API project and restore packages:
```bash
cd backend
dotnet restore
```

### 4. Run the Application

For development, you can run both frontend and backend simultaneously:

```bash
npm run dev
```

Or run them seperately:

**Backend only:**
```bash
npm run dev:backend
```

**Frontend only:**
```bash
npm run dev:frontend
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: https://localhost:5001

## Testing

Run backend tests:
```bash
npm run test:backend
```

Run frontend tests:
```bash
cd frontend
npm test
```

## Production Build

### Frontend Build

```bash
cd frontend
npm run build
```

This creates a `dist` folder with optimized production files.

### Backend Build

```bash
npm run build:backend
```

## IIS Deployment

### Prerequisites for IIS Deployment

1. **Install IIS** with the following features:
   - Web Server (IIS)
   - World Wide Web Services
   - Application Development Features
   - .NET Extensibility 4.8
   - ASP.NET 4.8

2. **Install .NET 8 Hosting Bundle**
   - Download from Microsoft's official website
   - This includes both the runtime and the ASP.NET Core Module

### Frontend Deployment (React App)

1. **Build the frontend application:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Copy build files to IIS:**
   - Copy the contents of `frontend/dist/` to `C:\inetpub\wwwroot\coflo-frontend\`

3. **Create IIS Site:**
   - Open IIS Manager
   - Right-click "Sites" → "Add Website"
   - Site name: `CoFlo-Frontend`
   - Physical path: `C:\inetpub\wwwroot\coflo-frontend\`
   - Port: `80` (or your preferred port)

4. **Configure URL Rewrite** (for React Router):
   - Install URL Rewrite Module from Microsoft
   - Add `web.config` in the frontend root:
   ```xml
   <?xml version="1.0" encoding="utf-8"?>
   <configuration>
     <system.webServer>
       <rewrite>
         <rules>
           <rule name="React Routes" stopProcessing="true">
             <match url=".*" />
             <conditions logicalGrouping="MatchAll">
               <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
               <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
             </conditions>
             <action type="Rewrite" url="/" />
           </rule>
         </rules>
       </rewrite>
     </system.webServer>
   </configuration>
   ```

### Backend Deployment (.NET API)

1. **Publish the API:**
   ```bash
   cd backend
   dotnet publish CoFlo.API/CoFlo.API.csproj -c Release -o ../publish
   ```

2. **Copy published files to IIS:**
   - Copy contents of `publish/` to `C:\inetpub\wwwroot\coflo-api\`

3. **Create IIS Application:**
   - Open IIS Manager
   - Right-click "Sites" → "Add Website"
   - Site name: `CoFlo-API`
   - Physical path: `C:\inetpub\wwwroot\coflo-api\`
   - Port: `8080` (or your preferred port)

4. **Configure Application Pool:**
   - Select the application pool for your API site
   - Set ".NET CLR Version" to "No Managed Code"
   - Set "Managed Pipeline Mode" to "Integrated"

5. **Set Permissions:**
   - Grant `IIS_IUSRS` read and execute permissions on the API folder
   - Grant `IIS_IUSRS` modify permissions on logs folder (if using file logging)

### Environment Configuration

1. **Update API URLs:**
   - In the frontend build, update API endpoints to point to your IIS-hosted API
   - Modify any configuration files to use production URLs

2. **Database Connection:**
   - Update `appsettings.json` in the API deployment with production database connection strings
   - Ensure SQL Server is accessible from the IIS server

3. **CORS Configuration:**
   - Configure CORS in the API to allow requests from your frontend domain
   - Update the API's `Startup.cs` or `Program.cs` as needed

### Security Considerations

- Enable HTTPS in production
- Configure proper authentication and authorization
- Set up proper logging and monitoring
- Regular security updates for both IIS and .NET runtime

## Troubleshooting

### Common Issues

**Port conflicts:**
- Use `npm run stop:frontend` and `npm run stop:backend` to stop development servers

**Build failures:**
- Ensure all dependencies are properly installed
- Check that .NET 8 SDK is correctly installed

**IIS deployment issues:**
- Verify .NET 8 Hosting Bundle is installed
- Check application pool settings
- Review IIS logs in `C:\inetpub\logs\LogFiles\`

**Database connection issues:**
- Verify connection strings are correct
- Ensure SQL Server is running and accessible
- Check firewall settings

### Logs

- **Backend logs:** Check the console output or configured log files
- **Frontend logs:** Check browser developer console
- **IIS logs:** Located in `C:\inetpub\logs\LogFiles\W3SVC1\`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the project repository.
