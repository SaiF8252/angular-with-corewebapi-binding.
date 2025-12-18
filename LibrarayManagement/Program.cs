
using LibrarayManagement.Model;
using LibrarayManagement.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using System;
using System.Security.Claims;
using System.Text;

namespace LibrarayManagement
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAngular", policy =>
                {
                    policy.AllowAnyOrigin() // Angular app URL
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                          
                });
            });

            builder.Services.AddControllers().AddJsonOptions(OP =>
            {
                OP.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
                OP.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
                OP.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
            });
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen(opt =>
            {
                //opt.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, new Microsoft.OpenApi.Models.OpenApiSecurityScheme()
                //{
                //    BearerFormat = "Jwt",
                //    In = ParameterLocation.Header,
                //    Description = "Provide Token",
                //    Name = "Authorization",
                //    Scheme = "bearer",
                //    Type = SecuritySchemeType.Http

                //});
                //opt.AddSecurityRequirement(new OpenApiSecurityRequirement()
                //{
                //    {

                //        new OpenApiSecurityScheme()
                //        {
                //            OpenApiReference = new BaseOpenApiReference()
                //            {
                //                Type = ReferenceType.SecurityScheme,
                //                Id= JwtBearerDefaults.AuthenticationScheme
                //            }
                //        },
                //        Array.Empty<string>()

                //    },
                //});

            });
            builder.Services.AddDbContext<LIbraryDb>(OPT =>
            {
                OPT.UseSqlServer(builder.Configuration.GetConnectionString("ApiDb"));
            });
            builder.Services.AddIdentity<AppUser, AppRole>()
                .AddEntityFrameworkStores<LIbraryDb>();
            builder.Services.AddAuthentication(opti =>
            {
                opti.DefaultAuthenticateScheme = opti.DefaultScheme
                = opti.DefaultChallengeScheme
                = opti.DefaultForbidScheme
                = opti.DefaultSignInScheme
                = opti.DefaultSignOutScheme
                = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer(token =>
            {
                byte[] key = Encoding.UTF8.GetBytes(builder.Configuration.GetValue<string>("Jwt:Key"));
                token.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),


                };

            });
            builder.Services.AddAuthorization(opt =>
            {
                opt.AddPolicy("editor", policyopt =>
                {
                    //policyopt.RequireRole("Admin");
                    //policyopt.RequireRole("Moderator");
                    policyopt.RequireAssertion(ctx =>
                   ctx.User.Claims.Any
                    (c =>
                        c.Type == ClaimTypes.Role &&
                       (c.Value == "Admin" || c.Value == "Moderator")
                      )
                     ||
                       ctx.User.Claims.Any(c =>
                       c.Type == ClaimTypes.Name &&
                       c.Value.ToLower().Contains("admin")
                         )
                    );

                });
            });

            builder.Services.AddScoped<IImageUpload, ImageUpload>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {app.MapOpenApi();  
                app.UseSwagger();
                app.UseSwaggerUI();
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/error");
            }
            app.UseCors("AllowAngular");
            app.UseHttpsRedirection();
            //app.UseRouting();
            app.UseStaticFiles();
            app.UseAuthentication();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
