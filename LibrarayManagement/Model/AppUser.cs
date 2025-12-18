using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace LibrarayManagement.Model
{
    public class AppUser: IdentityUser<Guid>
    { 
    }
    public class AppRole : IdentityRole<Guid> { }
}

