
# Miniland Social Profiles Management

## Overview
This document describes the management of official Miniland social media profiles in the application.

## Current Social Media Accounts

### Instagram (9 profiles)
- **miniland_esp** - Miniland España (Active)
- **minilanddolls** - Miniland Dolls (Active)
- **miniland_educational_** - Miniland Educational (Active)
- **miniland_profesional** - Miniland Profesional (Active)
- **minilandusa** - Miniland USA (Active)
- **miniland_italia** - Miniland Italia (Active)
- **miniland_france** - Miniland France (Active)
- **miniland_international** - Miniland International (Inactive - disused)
- **minilanddollsaus** - Miniland Dolls Australia (Inactive - purchased but disused)

### TikTok (2 profiles)
- **miniland_es** - Miniland España TikTok (Active)
- **miniland_usa** - Miniland USA TikTok (Inactive - needs reactivation)

### LinkedIn (1 profile)
- **miniland** - Miniland Corporate (Active)

### X/Twitter (1 profile)
- **miniland_es** - Miniland España X (Active)

### Pinterest (1 profile)
- **miniland_usa** - Miniland USA Pinterest (Active)

### YouTube (2 profiles)
- **miniland_nacional** - Miniland Nacional (Active)
- **miniland_international** - Miniland International (Active)

## Database Structure

The profiles are stored in the `social_profiles` table with the following structure:

```sql
CREATE TABLE social_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  handle TEXT NOT NULL,
  platform platform_type NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## Adding New Profiles

To add a new social profile:

1. **Via SQL:**
```sql
INSERT INTO social_profiles (name, handle, platform, active) 
VALUES ('Profile Name', 'handle', 'Platform', true);
```

2. **Via Application UI:**
- Navigate to the Profiles page
- Use the create functionality (if implemented)
- Select platform, enter name and handle

## Managing Profile Status

### Activating/Deactivating Profiles
- Use the toggle switch in the Profiles UI
- Or via SQL: `UPDATE social_profiles SET active = false WHERE id = 'profile_id';`

### Guidelines for Profile Status:
- **Active (true)**: Profile is currently used for content creation and campaigns
- **Inactive (false)**: Profile exists but is not used (disused accounts, needs reactivation, etc.)

## Platform Icons and Colors

The application uses specific colors and icons for each platform:

- **Instagram**: Purple-pink gradient, Instagram icon
- **TikTok**: Black background, "TT" text
- **LinkedIn**: Blue background, LinkedIn icon  
- **X**: Black background, "X" text
- **Pinterest**: Red background, "PT" text
- **YouTube**: Red background, YouTube icon

## Code Components

### Key Files:
- `src/hooks/useSocialProfiles.ts` - React hooks for profile management
- `src/pages/Profiles.tsx` - Main profiles management UI
- `src/types/supabase.ts` - TypeScript type definitions

### Key Functions:
- `useSocialProfiles()` - Fetch all profiles
- `useActiveSocialProfiles()` - Fetch only active profiles
- `useUpdateSocialProfile()` - Update profile data
- `useCreateSocialProfile()` - Create new profile
- `useDeleteSocialProfile()` - Delete profile

## Maintenance

### Regular Tasks:
1. Review inactive profiles quarterly
2. Update handles if social media accounts change
3. Verify active status matches actual usage
4. Add new platforms as Miniland expands

### Data Safety:
- Always keep inactive profiles in database for historical reference
- Use soft deletion (active flag) instead of hard deletion
- Backup before major changes
- Test profile changes in development first

## Migration History

**Latest Migration (2025-06-14):**
- Deleted all existing social profiles
- Inserted 16 official Miniland social profiles
- Set proper active/inactive status based on current usage
- Organized profiles by platform with correct handles

## Troubleshooting

### Common Issues:
1. **Profile not appearing in content creation**: Check if profile is marked as active
2. **Wrong platform icon**: Verify platform enum value matches exactly
3. **Handle changes**: Update handle in database and verify UI refresh

### Support:
- Check console logs for detailed error messages
- Verify Supabase connection and table permissions
- Ensure platform enum values match database schema
