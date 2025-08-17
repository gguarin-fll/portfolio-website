#!/bin/bash

# Script to revert GitHub Actions from SHA pins to version tags
# This allows Dependabot to manage versions properly

echo "Reverting GitHub Actions to version tags..."

# Map of SHA to version tags
declare -A ACTION_VERSIONS=(
    # actions
    ["actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683"]="actions/checkout@v4"
    ["actions/setup-node@39370e3970a6d050c480ffad4ff0ed4d3fdee5af"]="actions/setup-node@v4"
    ["actions/upload-artifact@b4b15b8c7c6ac21ea08fcf65892d2ee8f75cf882"]="actions/upload-artifact@v4"
    ["actions/download-artifact@fa0a91b85d4f404e444e00e005971372dc801d16"]="actions/download-artifact@v4"
    ["actions/github-script@60a0d83039c74a4aee543508d2ffcb1c3799cdea"]="actions/github-script@v7"
    ["actions/cache@6849a6489940f00c2f30c0fb92c6274307ccb58a"]="actions/cache@v4"
    
    # docker
    ["docker/setup-buildx-action@c47758b77c9736f4b2ef4073d4d51994fabfe349"]="docker/setup-buildx-action@v3"
    ["docker/login-action@9780b0c442fbb1117ed29e0efdff1e18412f7567"]="docker/login-action@v3"
    ["docker/build-push-action@4f58ea79222b3b9dc2c8bbdd6debcef730109a75"]="docker/build-push-action@v5"
    ["docker/metadata-action@dbef88086f6cef02e264edb7dbf63250c17cef6c"]="docker/metadata-action@v5"
    ["docker/setup-qemu-action@49b3bc8e6bdd4a60e6116a5414239cba5943d3cf"]="docker/setup-qemu-action@v3"
    
    # github
    ["github/codeql-action/init@662472033e021d55d94146f66f6058822b0b39fd"]="github/codeql-action/init@v3"
    ["github/codeql-action/autobuild@662472033e021d55d94146f66f6058822b0b39fd"]="github/codeql-action/autobuild@v3"
    ["github/codeql-action/analyze@662472033e021d55d94146f66f6058822b0b39fd"]="github/codeql-action/analyze@v3"
    ["github/codeql-action/upload-sarif@662472033e021d55d94146f66f6058822b0b39fd"]="github/codeql-action/upload-sarif@v3"
    
    # security tools
    ["aquasecurity/trivy-action@18f2510c396753b69d9d7ba2cc3d62e6e40dc289"]="aquasecurity/trivy-action@master"
    ["snyk/actions/node@b98d498629f1c368650224d6d212bf7dfa89e4bf"]="snyk/actions/node@master"
    ["anchore/scan-action@5df630c4e77c69a0119dcdd145f840e91e8301a8"]="anchore/scan-action@v3"
    ["trufflesecurity/trufflehog@4778a28c2fb96fd90ff81d1b9ad02eafc58e5b89"]="trufflesecurity/trufflehog@main"
    ["gitleaks/gitleaks-action@44c470d8c17b97a318e88c1e45612d9fccc59b6a"]="gitleaks/gitleaks-action@v2"
    ["returntocorp/semgrep-action@713efdd345f3035192eaa63f56867b88e63e4e5d"]="returntocorp/semgrep-action@v1"
    
    # other
    ["peter-evans/create-pull-request@5e914681df9dc83aa4e4905692ca88beb2f9e91f"]="peter-evans/create-pull-request@v5"
    ["peter-evans/dockerhub-description@e98e4d1628a5f3be2be7c231e50981aee98723ae"]="peter-evans/dockerhub-description@v3"
    ["softprops/action-gh-release@e7a8f85e1c69a9ca6ba914b1d2117a91fc1d3a62"]="softprops/action-gh-release@v1"
    ["bobheadxi/deployments@2b75b27e96e91a4e656bb7f2f96e99e96f82a521"]="bobheadxi/deployments@v1"
    ["kentaro-m/auto-assign-action@869caad37b4dc8e61df844dc8d15324e7c108d76"]="kentaro-m/auto-assign-action@v1.2.5"
    ["amannn/action-semantic-pull-request@0723387faaf9b38adef4775cd42cfd5155ed6017"]="amannn/action-semantic-pull-request@v5"
    ["webfactory/ssh-agent@dc588b651fe13675774614f8e6a936a468676387"]="webfactory/ssh-agent@v0.9.0"
    ["appleboy/ssh-action@25ce8cbbcb08177468c7ff7ec5cbfa236f9341e1"]="appleboy/ssh-action@v1.0.0"
    ["8398a7/action-slack@28ba43ae48961b90635b50953d216767a6bea486"]="8398a7/action-slack@v3"
    ["treosh/lighthouse-ci-action@v10"]="treosh/lighthouse-ci-action@v10"
)

# Process all workflow files
for file in .github/workflows/*.yml; do
    echo "Processing $file..."
    
    # Create a temporary file
    temp_file=$(mktemp)
    cp "$file" "$temp_file"
    
    # Replace each SHA with its version tag
    for sha in "${!ACTION_VERSIONS[@]}"; do
        version="${ACTION_VERSIONS[$sha]}"
        sed -i "s|$sha|$version|g" "$temp_file"
    done
    
    # Check if file changed
    if ! diff -q "$file" "$temp_file" > /dev/null; then
        mv "$temp_file" "$file"
        echo "  ✓ Updated $file"
    else
        rm "$temp_file"
        echo "  - No changes needed for $file"
    fi
done

echo "Done! All actions reverted to version tags."
echo ""
echo "Next steps:"
echo "1. Review the changes with: git diff"
echo "2. Commit the changes"
echo "3. Push to GitHub"
echo "4. Dependabot will manage version updates going forward"
echo "5. Use 'Pin GitHub Actions' workflow for security when needed"