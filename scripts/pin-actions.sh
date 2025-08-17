#!/bin/bash

# Script to pin GitHub Actions to specific commit SHAs
# This improves security by ensuring actions can't be modified

echo "Pinning GitHub Actions to specific commit SHAs..."

# Define the mappings of action tags to their current SHAs
declare -A ACTION_PINS=(
    # Core GitHub Actions
    ["actions/checkout@v4"]="actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683"  # v4.2.2
    ["actions/setup-node@v4"]="actions/setup-node@39370e3970a6d050c480ffad4ff0ed4d3fdee5af"  # v4.1.0
    ["actions/upload-artifact@v4"]="actions/upload-artifact@b4b15b8c7c6ac21ea08fcf65892d2ee8f75cf882"  # v4.4.3
    ["actions/github-script@v7"]="actions/github-script@60a0d83039c74a4aee543508d2ffcb1c3799cdea"  # v7.0.1
    ["github/codeql-action/init@v3"]="github/codeql-action/init@662472033e021d55d94146f66f6058822b0b39fd"  # v3.27.0
    ["github/codeql-action/autobuild@v3"]="github/codeql-action/autobuild@662472033e021d55d94146f66f6058822b0b39fd"
    ["github/codeql-action/analyze@v3"]="github/codeql-action/analyze@662472033e021d55d94146f66f6058822b0b39fd"
    ["github/codeql-action/upload-sarif@v3"]="github/codeql-action/upload-sarif@662472033e021d55d94146f66f6058822b0b39fd"
    
    # Docker actions
    ["docker/setup-buildx-action@v3"]="docker/setup-buildx-action@c47758b77c9736f4b2ef4073d4d51994fabfe349"  # v3.7.1
    ["docker/login-action@v3"]="docker/login-action@9780b0c442fbb1117ed29e0efdff1e18412f7567"  # v3.3.0
    ["docker/metadata-action@v5"]="docker/metadata-action@dbef88086f6cef02e264edb7dbf63250c17cef6c"  # v5.5.1
    ["docker/build-push-action@v6"]="docker/build-push-action@4f58ea79222b3b9dc2c8bbdd6debcef730109a75"  # v6.9.0
    
    # Other actions
    ["webfactory/ssh-agent@v0.9.0"]="webfactory/ssh-agent@dc588b651fe13675774614f8e6a936a468676387"  # v0.9.0
    ["peter-evans/create-pull-request@v7"]="peter-evans/create-pull-request@5e914681df9dc83aa4e4905692ca88beb2f9e91f"  # v7.0.5
    ["peter-evans/dockerhub-description@v4"]="peter-evans/dockerhub-description@e98e4d1628a5f3be2be7c231e50981aee98723ae"  # v4.0.0
    ["softprops/action-gh-release@v2"]="softprops/action-gh-release@e7a8f85e1c69a9ca6ba914b1d2117a91fc1d3a62"  # v2.0.9
    ["kentaro-m/auto-assign-action@v2.0.0"]="kentaro-m/auto-assign-action@869caad37b4dc8e61df844dc8d15324e7c108d76"  # v2.0.0
    ["amannn/action-semantic-pull-request@v5"]="amannn/action-semantic-pull-request@0723387faaf9b38adef4775cd42cfd5155ed6017"  # v5.5.3
    ["codecov/codecov-action@v5"]="codecov/codecov-action@35425e3b7c4d0ee2042a86f777843ca443d48529"  # v5.0.2
    ["aquasecurity/trivy-action@master"]="aquasecurity/trivy-action@18f2510c396753b69d9d7ba2cc3d62e6e40dc289"  # master
    ["anchore/scan-action@v6"]="anchore/scan-action@5df630c4e77c69a0119dcdd145f840e91e8301a8"  # v6.0.0
    ["snyk/actions/node@master"]="snyk/actions/node@b98d498629f1c368650224d6d212bf7dfa89e4bf"  # master
    ["trufflesecurity/trufflehog@main"]="trufflesecurity/trufflehog@4778a28c2fb96fd90ff81d1b9ad02eafc58e5b89"  # main
    ["gitleaks/gitleaks-action@v2"]="gitleaks/gitleaks-action@44c470d8c17b97a318e88c1e45612d9fccc59b6a"  # v2.3.6
    ["returntocorp/semgrep-action@v1"]="returntocorp/semgrep-action@713efdd345f3035192eaa63f56867b88e63e4e5d"  # v1
    ["appleboy/ssh-action@v1.0.3"]="appleboy/ssh-action@25ce8cbbcb08177468c7ff7ec5cbfa236f9341e1"  # v1.0.3
    ["bobheadxi/deployments@v1"]="bobheadxi/deployments@2b75b27e96e91a4e656bb7f2f96e99e96f82a521"  # v1.5.0
    ["azure/setup-kubectl@v4"]="azure/setup-kubectl@3e0aec4d80787158d308d7b364cb1b702e7feb7f"  # v4.0.0
    ["actions/delete-package-versions@v5"]="actions/delete-package-versions@e5bc658cc4c965c472efe991f8beea3981499c55"  # v5.0.0
)

# Process all workflow files
for file in .github/workflows/*.yml; do
    echo "Processing $file..."
    
    for action in "${!ACTION_PINS[@]}"; do
        sha="${ACTION_PINS[$action]}"
        # Escape special characters for sed
        escaped_action=$(echo "$action" | sed 's/[[\.*^$()+?{|]/\\&/g')
        escaped_sha=$(echo "$sha" | sed 's/[[\.*^$()+?{|]/\\&/g')
        
        # Replace the action reference with the pinned SHA
        sed -i "s|uses: $escaped_action|uses: $escaped_sha|g" "$file"
    done
done

echo "✅ All GitHub Actions have been pinned to specific commit SHAs"
echo ""
echo "Note: You should periodically update these SHAs to get security updates."
echo "Use tools like Dependabot to automatically update pinned actions."