---
description: A workflow to check status, add files, and commit changes with a generated message.
---

1. Run `git status` to see what files have been changed.
// turbo
2. Run `git add .` to stage all the changes.
3. Review the staged changes and generate a concise, descriptive commit message based on the modifications. Present this message to the user for approval.
4. Once the user approves or edits the message, commit the changes using `git commit -m "<message>"`.
