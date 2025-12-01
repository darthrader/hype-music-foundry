# Publishing to Foundry VTT Module Browser

Follow these steps to make your module installable through Foundry's built-in module browser.

## Step 1: Create a GitHub Repository

1. Go to https://github.com and create a new repository
2. Name it: `hype-music-foundry`
3. Make it **public** (required for Foundry module browser)
4. Don't initialize with README (we already have one)

## Step 2: Push Your Code to GitHub

```powershell
# Navigate to your module directory
cd c:\Workspace\HypeMusicFoundry

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial release of Hype Music Foundry"

# Add your GitHub repository as remote (replace with your username)
git remote add origin https://github.com/YOUR_USERNAME/hype-music-foundry.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Update module.json with Your GitHub Info

Before creating a release, update these URLs in `module.json`:
- Replace `yourusername` with your actual GitHub username
- The URLs should look like:
  - `https://github.com/YOUR_USERNAME/hype-music-foundry`

## Step 4: Create a GitHub Release

1. Go to your repository on GitHub
2. Click **Releases** → **Create a new release**
3. Click **Choose a tag** and type: `1.0.0` (then click "Create new tag")
4. Set **Release title**: `v1.0.0 - Initial Release`
5. Add release notes (describe features)
6. Click **Publish release**

The GitHub Action will automatically:
- Create `module.zip` with all necessary files
- Attach `module.json` to the release
- Update download URLs

## Step 5: Test the Manifest URL

After the release is created, your manifest URL will be:
```
https://github.com/YOUR_USERNAME/hype-music-foundry/releases/latest/download/module.json
```

Test it in Foundry VTT:
1. Go to **Add-on Modules** tab
2. Click **Install Module**
3. Paste your manifest URL
4. Click **Install**

## Step 6: Submit to Foundry Package Listing (Optional)

To appear in the module browser search:

1. Go to https://foundryvtt.com/packages/submit
2. Log in with your Foundry account
3. Submit your package with:
   - **Package Type**: Module
   - **Manifest URL**: Your manifest URL from Step 5
4. Wait for approval (usually 1-2 days)

Once approved, users can find and install your module by searching "Hype Music" in Foundry's module browser!

## Future Updates

To release updates:

1. Make your changes
2. Commit and push to GitHub
3. Create a new release with a new version tag (e.g., `1.0.1`, `1.1.0`)
4. The GitHub Action will handle the rest
5. Users can update through Foundry's module manager

## Quick Reference

**Your manifest URL format:**
```
https://github.com/YOUR_USERNAME/hype-music-foundry/releases/latest/download/module.json
```

**Versioning:**
- Patch (bug fixes): 1.0.0 → 1.0.1
- Minor (new features): 1.0.0 → 1.1.0
- Major (breaking changes): 1.0.0 → 2.0.0
