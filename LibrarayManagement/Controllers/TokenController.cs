using LibrarayManagement.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class TokenController : ControllerBase
{
    private readonly SignInManager<AppUser> _signInManager;
    private readonly UserManager<AppUser> _userManager;
    private readonly IConfiguration _configuration;

    public TokenController(SignInManager<AppUser> signInManager, UserManager<AppUser> userManager, IConfiguration configuration)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _configuration = configuration;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> SignUp(UserDto userDto)
    {
        try
        {
            var appUser = new AppUser
            {
                UserName = userDto.UserName,
                Email = userDto.UserName,
              

            };

            var result = await _userManager.CreateAsync(appUser, userDto.Password);

            if (result.Succeeded) return Ok(result);
            return BadRequest(result.Errors);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> LogIn(UserDto userDto)
    {
        try
        {
            var user = await _userManager.FindByNameAsync(userDto.UserName);
            if (user == null) return BadRequest("User not found");

            var valid = await _userManager.CheckPasswordAsync(user, userDto.Password);
            if (!valid) return BadRequest("Invalid credentials");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Sid, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email)
            };
            claims.AddRange((await _userManager.GetRolesAsync(user)).Select(r => new Claim(ClaimTypes.Role, r)));

            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
            var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityTokenHandler().WriteToken(new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Issuer"],
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            ));

            return Ok(token);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize, HttpGet("GetUserInfo")]
    public IActionResult GetUserInfo()
    {
        try
        {
            var loginUser = HttpContext.User;
            var roles = new List<string>();
            string name = loginUser?.Identity?.Name ?? "";
            string email = "";

            foreach (var claim in loginUser.Claims)
            {
                if (claim.Type == ClaimTypes.Email) email = claim.Value;
                if (claim.Type == ClaimTypes.Role) roles.Add(claim.Value);
            }

            return Ok(new { name, email, roles = string.Join(",", roles) });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
