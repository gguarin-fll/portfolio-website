#!/bin/bash

# Script to pin GitHub Actions to their current commit SHAs
# This improves security by preventing supply chain attacks

set -e

echo "📌 Pinning GitHub Actions to commit SHAs..."

# Get the latest commit SHA for each action
get_action_sha() {
    local action=$1
    local tag=$2
    
    # Extract owner and repo from action
    IFS='/' read -r owner repo <<< "$action"
    
    # Get the commit SHA for the tag
    sha=$(curl -s "https://api.github.com/repos/$owner/$repo/git/refs/tags/$tag" | grep '"sha"' | head -1 | cut -d'"' -f4)
    
    if [ -z "$sha" ]; then
        # If tag lookup fails, try as branch
        sha=$(curl -s "https://api.github.com/repos/$owner/$repo/git/refs/heads/$tag" | grep '"sha"' | head -1 | cut -d'"' -f4)
    fi
    
    echo "$sha"
}

# Process workflow files
for workflow in .github/workflows/*.yml; do
    echo "Processing $workflow..."
    
    # Create backup
    cp "$workflow" "$workflow.bak"
    
    # Find all uses of actions and pin them
    while IFS= read -r line; do
        if [[ $line =~ uses:\ *([^@]+)@([^[:space:]]+) ]]; then
            action="${BASH_REMATCH[1]}"
            version="${BASH_REMATCH[2]}"
            
            # Skip if already pinned to SHA (40 chars hex)
            if [[ $version =~ ^[a-f0-9]{40}$ ]]; then
                echo "  ✓ $action already pinned"
                continue
            fi
            
            # Get SHA for this version
            sha=$(get_action_sha "$action" "$version")
            
            if [ -n "$sha" ]; then
                # Replace version with SHA in file
                sed -i "s|$action@$version|$action@$sha|g" "$workflow"
                echo "  ✓ Pinned $action@$version to $sha"
            else
                echo "  ⚠ Could not resolve SHA for $action@$version"
            fi
        fi
    done < "$workflow"
    
    # Remove backup if successful
    rm "$workflow.bak"
done

echo "✅ Done! All actions have been pinned to their commit SHAs."
echo ""
echo "Next steps:"
echo "1. Review the changes with: git diff"
echo "2. Commit the changes: git add -A && git commit -m 'chore: pin GitHub Actions to commit SHAs'"
echo "3. Push to create a PR: git push"