
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Online_Book_Store.Models;

namespace Online_Book_Store
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllers();
            // Add services to the container.
            builder.Services.AddDbContextPool<AppDBContext>(
                options => options.UseSqlServer(builder.Configuration.GetConnectionString("myconnection")));
            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            // Configure JWT Authentication
            var key = builder.Configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(key))
            {
                throw new ArgumentException("JWT Key is missing in configuration.");
            }
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false; // Allow HTTP for development
                    options.SaveToken = true; // Save the token in the AuthenticationProperties
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true, // Ensure token hasn't expired
                        ValidateIssuerSigningKey = true, // Validate the signing key
                        ValidIssuer = builder.Configuration["Jwt:Issuer"],
                        ValidAudience = builder.Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
                    };
                });
            // Add CORS policy
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp", policy =>
                {
                    policy.WithOrigins("http://localhost:3000") // Allow requests from your React app
                          .AllowAnyMethod() // Allow all HTTP methods
                          .AllowAnyHeader() // Allow all headers
                          .AllowCredentials(); // Allow credentials (e.g., cookies, authorization headers)
                });
            });

            var app = builder.Build();
            app.UseHttpsRedirection();
            // Use CORS policy
            app.UseCors("AllowReactApp");
            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseAuthorization();

            app.UseAuthentication();
            app.MapControllers();

            app.Run();
        }
    }
}
