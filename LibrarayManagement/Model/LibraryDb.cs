using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

namespace LibrarayManagement.Model
{
    public class LIbraryDb : IdentityDbContext<AppUser, AppRole, Guid>
    {
        public LIbraryDb(DbContextOptions<LIbraryDb> options) : base(options) { }

        public DbSet<Member> Members { get; set; }
        public DbSet<Book> Books { get; set; }
        public DbSet<Issue> Issues { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
           base.OnModelCreating(modelBuilder);
            // Additional model configurations can be added here
            modelBuilder.Entity<Member>()
                .HasMany(m => m.Issue)
                .WithOne(i => i.Member)
                .HasForeignKey(i => i.MemberId);
            modelBuilder.Entity<Issue>()
                .HasMany(i => i.Books)
                .WithOne(b => b.Issue)
                .HasForeignKey(b => b.IssueId);
          
        }
    }
}
