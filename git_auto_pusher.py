import os
import subprocess

def run_command(command):
    """Runs a shell command and prints output."""
    process = subprocess.run(command, shell=True, capture_output=True, text=True)
    if process.returncode == 0:
        print(f"✅ {command} executed successfully!\n")
    else:
        print(f"❌ Error in: {command}\n{process.stderr}\n")
        exit(1)

# Banner
print("\n## Git Automation Script - Done by AtutiBonface Sozini Xengine ##\n")

# Step 1: Install Git
install_choice = input("Do you want to install Git? (y/n): ").strip().lower()
if install_choice == "y":
    run_command("sudo apt install git")

# Step 2: Configure Git
user_name = input("Enter your GitHub username: ").strip()
user_email = input("Enter your GitHub email: ").strip()
run_command(f'git config --global user.name "{user_name}"')
run_command(f'git config --global user.email "{user_email}"')

# Step 3: Initialize Git Repository
init_choice = input("Do you want to initialize a new Git repository here? (y/n): ").strip().lower()
if init_choice == "y":
    run_command("git init")

# Step 4: Set Remote Repository
repo_url = input("Enter your GitHub repository URL (e.g., https://github.com/your-username/repo.git): ").strip()
run_command(f"git remote add origin {repo_url}")
run_command("git remote -v")

# Step 5: Set Remote URL with Authentication
auth_choice = input("Do you want to set the remote URL with authentication? (y/n): ").strip().lower()
if auth_choice == "y":
    github_token = input("Enter your GitHub Personal Access Token: ").strip()
    repo_name = repo_url.split('/')[-1]
    auth_url = f"https://{user_name}:{github_token}@github.com/{user_name}/{repo_name}"
    run_command(f"git remote set-url origin {auth_url}")

# Step 6: Add and Commit Changes
commit_message = input("Enter commit message (default: 'Initial commit'): ").strip() or "Initial commit"
run_command("git add .")
run_command(f'git commit -m "{commit_message}"')

# Step 7: Push Changes
branch = input("Enter branch name (default: main): ").strip() or "main"
run_command(f"git push origin {branch}")

print("🎉 Git setup and push completed successfully!")
