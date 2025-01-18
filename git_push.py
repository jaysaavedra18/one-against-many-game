import subprocess
import sys

def git_push(commit_message):
    # Add all changes
    subprocess.run(["git", "add", "."], check=True)
    
    # Commit with the provided message
    subprocess.run(["git", "commit", "-m", commit_message], check=True)
    
    # Push the changes
    subprocess.run(["git", "push"], check=True)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python git_push.py '<commit_message>'")
    else:
        commit_message = sys.argv[1]
        try:
            git_push(commit_message)
            print("Changes pushed successfully!")
        except subprocess.CalledProcessError:
            print("Error during git push process.")
