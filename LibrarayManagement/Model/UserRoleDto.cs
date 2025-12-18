using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LibrarayManagement.Model
{
    public class UserRolEdTO
    {
        [Required]
        public string UserName { get; set; } = default!;
        public IList<string> Roles { get; set; } = [];
    }
}
