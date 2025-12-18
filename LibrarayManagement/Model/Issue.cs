
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibrarayManagement.Model
{
    public class Issue
    {
        [Key]
        public int IssueId { get; set; }

        
   

        [ForeignKey("Member")]
        public int MemberId { get; set; }
        public Member? Member { get; set; }

        public DateTime IssueDate { get; set; } = DateTime.Now;
        [DisplayFormat(ConvertEmptyStringToNull = true)]
        public DateTime? ReturnDate { get; set; } = null;
        public bool IsReturned { get; set; }
        public List<Book>? Books { get; set; }
    }
}
